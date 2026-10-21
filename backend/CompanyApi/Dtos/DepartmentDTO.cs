namespace CompanyApi.Dtos;

public class DepartmentDto
{
    public int Id { get; set; }

    public string DepName { get; set; } = string.Empty;

    public string? DepLocation { get; set; }

    public int EmployeesCount { get; set; }
}