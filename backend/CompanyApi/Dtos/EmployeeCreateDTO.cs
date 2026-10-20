using System.ComponentModel.DataAnnotations;

namespace CompanyApi.Dtos;
public class EmployeeCreateDTO
{
    [Required]
    [StringLength(20)]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    [StringLength(20)]
    public string LastName { get; set; } = string.Empty;
    public string? EmployeeRole { get; set; }
    [Required]
    [StringLength(10)]
    public string EmployeeCode { get; set; } = string.Empty;
    public int DepartmentRef { get; set; }
}