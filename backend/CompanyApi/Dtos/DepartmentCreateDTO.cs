using System.ComponentModel.DataAnnotations;

namespace CompanyApi.Dtos;

public class DepartmentCreateDTO
{
    [Required]
    [StringLength(100)]
    public string DepName { get; set; } = string.Empty;

    [StringLength(255)]
    public string? DepLocation { get; set; }
}