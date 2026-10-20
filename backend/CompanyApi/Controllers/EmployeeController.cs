using CompanyApi.Data;
using CompanyApi.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CompanyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    private readonly CompanyDBContext _companyDbContext;

    public EmployeeController(CompanyDBContext companyDbContext)
    {
        _companyDbContext = companyDbContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<EmployeeDTO>>> GetAllAsync()
    {
        var employeeList = await _companyDbContext.Employees
            .Select(e => new EmployeeDTO
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                EmployeeRole = e.EmployeeRole,
                EmployeeCode = e.EmployeeCode,
                DepartmentRef = e.DepartmentRef,
                DepartmentName = e.Department.DepName
            })
            .ToListAsync();

        return Ok(employeeList);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<EmployeeDTO>> GetByIdAsync(int id)
    {
        var employee = await _companyDbContext.Employees
            .Where(e => e.Id == id)
            .Select(e => new EmployeeDTO
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                EmployeeRole = e.EmployeeRole,
                EmployeeCode = e.EmployeeCode,
                DepartmentRef = e.DepartmentRef,
                DepartmentName = e.Department.DepName
            })
            .FirstOrDefaultAsync();

        if (employee is null)
        {
            return NotFound();
        }

        return Ok(employee);
    }

    [HttpGet("department/{id:int}")]
    public async Task<ActionResult<List<EmployeeDTO>>> GetByDepartmentAsync(int id)
    {
        var employeeList = await _companyDbContext.Employees
            .Where(e => e.DepartmentRef == id)
            .Select(e => new EmployeeDTO
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                EmployeeRole = e.EmployeeRole,
                EmployeeCode = e.EmployeeCode,
                DepartmentRef = e.DepartmentRef,
                DepartmentName = e.Department.DepName
            })
            .ToListAsync();

        return Ok(employeeList);
    }
}