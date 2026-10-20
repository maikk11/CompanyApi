namespace CompanyApi.Models;

public class Department
{
    public int Id { get; set; }
    public string DepName { get; set; } = string.Empty;
    public string? DepLocation { get; set; }
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
