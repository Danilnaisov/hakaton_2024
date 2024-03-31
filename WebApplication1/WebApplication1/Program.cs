using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using WebApplication1.Data;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddHostedService<TimerService>();
builder.Services.AddScoped<ParseService, ParseService>();
builder.Services.AddDbContext<EventContext>(options =>
    options.UseMySql("server=localhost;port=3306;uid=root;database=EventsPerm", new MySqlServerVersion(new Version(8, 0, 11))));
builder.Services.AddMvc(option => option.EnableEndpointRouting = false);
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000").AllowAnyMethod()
                          .AllowAnyHeader();
                      });
});
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Руководство",
        Description = "123"
    });
    var filePath = Path.Combine(AppContext.BaseDirectory, "ASP_GET.xml");
    c.IncludeXmlComments(filePath);
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.UseMvcWithDefaultRoute();

app.MapRazorPages();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Запрос GET");
});

app.Run();
