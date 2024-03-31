using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public class EventContext : DbContext
    {
        string _connection = "server=localhost;port=3306;uid=root;database=eventsperm";
        public EventContext (DbContextOptions<EventContext> options)
            : base(options)
        {

        }
        public EventContext()
            => Database.EnsureCreated();
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql(_connection, new MySqlServerVersion(new Version(8, 0, 11)));
        }
        public DbSet<WebApplication1.Models.Event> Events { get; set; } = default!;
        public async void ClearTable()
        {
            var list = await Events.ToListAsync();
            Events.RemoveRange(list);
            SaveChanges();
        }
    }
}
