namespace CompanyApi.Dtos;
public class EmployeeUpdateDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? EmployeeRole { get; set; }
    public string EmployeeCode { get; set; } = string.Empty;
    public int DepartmentRef { get; set; }
}