using Microsoft.EntityFrameworkCore;
using AviFy.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace AviFy.Data
{
    public class AppDbContext : IdentityDbContext
    {


        public DbSet<Usuario> Usuarios { get; set; }


        public AppDbContext(DbContextOptions options ) : base(options) 
        { 

        }

    }
}
