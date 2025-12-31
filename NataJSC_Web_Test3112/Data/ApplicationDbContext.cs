using Microsoft.EntityFrameworkCore;
using NataJSC_Web_Test3112.Models;

namespace NataJSC_Web_Test3112.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<LandOwner> LandOwners { get; set; }
        public DbSet<ForestArea> ForestAreas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                .HasIndex(u => u.UserName)
                .IsUnique();
            modelBuilder.Entity<ForestArea>()
                .HasIndex(f => f.Code)
                .IsUnique();
            modelBuilder.Entity<LandOwner>()
                .HasMany(lo => lo.ForestAreas)
                .WithOne(fa => fa.LandOwner)
                .HasForeignKey(fa => fa.LandOwnerId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
