

using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

using System.Linq;
using Microsoft.AspNetCore.Identity;

namespace Lims
{
    public class IdentityContext : DbContext
    {
        public DbSet<TestUserIdentity> Users { get; set; }
        public DbSet<TestUserClaim> Claims { get; set; }

        public IdentityContext()
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            builder.UseInMemoryDatabase("IdentityDB");
            base.OnConfiguring(builder);
        }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<TestUserIdentity>().HasKey( i => i.Id );
            builder.Entity<TestUserIdentity>().HasMany( i => i.Claims ).WithOne( c => c.User );

            builder.Entity<TestUserClaim>().HasKey( c => c.Id );
            //builder.Entity<TestUserClaim>().HasOne( c => c.User );

            PasswordHasher<TestUserIdentity> hasher = new PasswordHasher<TestUserIdentity>();
            var user = new TestUserIdentity { Id = 1, UserName = "moa995", NormalizedUserName = "MOA995", TwoFactorEnabled = false, PhoneNumberConfirmed = false, PhoneNumber = "96599828764", EmailConfirmed = false, Email = "mabdullah83@gmail.com", NormalizedEmail = "MABDULLAH83@GMAIL.COM",  };
            user.PasswordHash = hasher.HashPassword(user, "maa");

            builder.Entity<TestUserIdentity>().HasData( user );

            var claim = new TestUserClaim { Id = 1, UserId = 1, ClaimType = System.Security.Claims.ClaimTypes.Role, ClaimValue = "admin" };
            builder.Entity<TestUserClaim>().HasData(claim);

            // builder.Entity<TestUserIdentity>().ToTable("Users").HasDiscriminator<string>("UserType").HasValue<TestUserEmployeeIdentity>("Employee").HasValue<TestUserCustomerIdentity>("Customer");
            // builder.Entity<TestUserIdentity>().ToTable("Users").HasDiscriminator<UserTypes>("UserType").HasValue<TestUserEmployeeIdentity>(UserTypes.Employee).HasValue<TestUserCustomerIdentity>(UserTypes.Customer);

            
            base.OnModelCreating(builder);
        }

        // private enum UserTypes 
        // {
        //     Employee = 1,
        //     Customer = 2
        // }
    }

    public class TestUserEmployeeIdentity : TestUserIdentity
    {
        public int EmployeeId { get; set; }
    }

    public class TestUserCustomerIdentity : TestUserIdentity
    {
        public int CustomerId { get; set; }
    }
}