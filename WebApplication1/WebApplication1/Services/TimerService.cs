
using WebApplication1.Data;

namespace WebApplication1.Services
{
    public class TimerService : IHostedService, IDisposable
    {
        private Timer _timer;
        private readonly IServiceScopeFactory _scopeFactory;
        public TimerService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }
        public void Dispose()
        {
            _timer?.Dispose();
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromHours(1));
            return Task.CompletedTask;
        }
        private void DoWork(object state)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                // Получаем необходимые сервисы из контейнера зависимостей
                var parse = scope.ServiceProvider.GetRequiredService<ParseService>();

                // Вызываем метод, который нужно выполнить каждый раз при срабатывании таймера
                parse.Parse();
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }
    }
}
