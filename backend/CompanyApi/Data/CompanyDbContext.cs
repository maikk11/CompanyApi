using Microsoft.EntityFrameworkCore;
using CompanyApi.Models;

namespace CompanyApi.Data;
public class CompanyDBContext : DbContext
{
    public CompanyDBContext(DbContextOptions<CompanyDBContext> options) : base(options){}
    public DbSet<Department> Departments { get; set; }
    public DbSet<Employee> Employees { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>().ToTable("Employee");
        modelBuilder.Entity<Department>().ToTable("Department");
        modelBuilder.Entity<Employee>()
            .HasOne(e => e.Department)
            .WithMany(d => d.Employees)
            .HasForeignKey(e => e.DepartmentRef)
            .OnDelete(DeleteBehavior.Cascade);
    }
}