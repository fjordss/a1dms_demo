using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Npgsql;

namespace A1DMS
{
    public class Context : DbContext
    {
        public Context(string connectionString) : base(Context.getOptions(connectionString))
        {

        }

        public Context(DbContextOptions<Context> options) : base(options)
        {

        }

        private static DbContextOptions getOptions(string connectionString)
        {
            return NpgsqlDbContextOptionsBuilderExtensions.UseNpgsql(new DbContextOptionsBuilder(), connectionString).Options;
        }

        public DbSet<Administrator> Administrators { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<NGHCard> NGHCards { get; set; }
        public DbSet<ActionItem> ActionItems { get; set; }
        public DbSet<Site> Sites { get; set; }
        public DbSet<CardAttachment> CardAttachments { get; set; }
        public DbSet<Nomination> Nominations { get; set; }
        public DbSet<NominationReport> NominationReports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Department>(entity =>
            {
                entity.HasIndex("Name").IsUnique();
            });

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasOne(e => e.Company).WithMany(e => e.Employees).HasForeignKey(e => e.CompanyId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Department).WithMany(e => e.Employees).HasForeignKey(e => e.DepartmentId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Site).WithMany(e => e.Employees).HasForeignKey(e => e.SiteId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<NGHCard>(entity =>
            {
                entity
                    .HasOne(e => e.Employee)
                    .WithMany(e => e.NGHCards)
                    .HasForeignKey(e => e.EmployeeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity
                    .HasOne(e => e.ActionItem)
                    .WithOne(e => e.NGHCard)
                    .HasForeignKey<ActionItem>(e => e.NGHCardId)
                    .HasConstraintName("ActionItem_fkey")
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ActionItem>(entity =>
            {
                entity
                    .HasOne(e => e.NGHCard)
                    .WithOne(e => e.ActionItem)
                    .HasForeignKey<NGHCard>(e => e.ActionItemId)
                    .HasConstraintName("NGHCard_fkey")
                    .OnDelete(DeleteBehavior.Restrict);

                entity
                    .HasOne(e => e.Responsible)
                    .WithMany(e => e.ActionItems)
                    .HasForeignKey(e => e.ResponsibleId);
            });

            modelBuilder.Entity<CardAttachment>(entity =>
            {
                entity
                    .HasOne(e => e.NGHCard)
                    .WithMany(e => e.CardAttachments)
                    .HasForeignKey(e => e.NGHCardId);
            });

            modelBuilder.Entity<Nomination>(entity =>
            {
                entity
                    .HasOne(e => e.NGHCard)
                    .WithMany(e => e.Nominations)
                    .HasForeignKey(e => e.NGHCardId);

                entity
                    .HasOne(e => e.Author)
                    .WithMany(e => e.Nominations)
                    .HasForeignKey(e => e.AuthorId);
            });

            modelBuilder.Entity<NominationReport>(entity =>
            {
                entity
                    .HasOne(e => e.Site)
                    .WithMany(e => e.NominationReports)
                    .HasForeignKey(e => e.SiteId);
            });

            modelBuilder.Entity<Administrator>(entity =>
            {
                entity
                    .HasOne(a => a.CreatedBy)
                    .WithMany(a => a.CreatedUsers)
                    .HasForeignKey(a => a.CreatedById);
            });

            modelBuilder.HasPostgresExtension("uuid-ossp");
        }

        /*protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //base.OnConfiguring(optionsBuilder);
            //optionsBuilder.UseNpgsql("Host=rc1b-zosm0f5hckr39k6n.mdb.yandexcloud.net;Port=6432;Database=a1dms;Username=kkERaY1e247J;Password=h11KP&jWD6jl");
            optionsBuilder.UseNpgsql("Host=localhost;Database=a1;Username=postgres;Password=123qwe$$");
        }*/
    }
}
