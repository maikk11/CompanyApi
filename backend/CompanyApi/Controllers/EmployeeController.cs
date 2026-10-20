using CompanyApi.Data;
using CompanyApi.Dtos;
using CompanyApi.Models;
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
    [HttpPost]
    public async Task<ActionResult<EmployeeDTO>> CreateAsync(EmployeeCreateDTO employeeDto)
    {
        var department = await _companyDbContext.Departments
            .FirstOrDefaultAsync(d => d.Id == employeeDto.DepartmentRef);

        if (department is null)
        {
            return BadRequest($"Department {employeeDto.DepartmentRef} does not exist.");
        }

        var codeExists = await _companyDbContext.Employees
            .AnyAsync(e => e.EmployeeCode == employeeDto.EmployeeCode);

        if (codeExists)
        {
            return Conflict($"An employee with code {employeeDto.EmployeeCode} already exists.");
        }

        var employee = new Employee
        {
            FirstName = employeeDto.FirstName,
            LastName = employeeDto.LastName,
            EmployeeRole = employeeDto.EmployeeRole,
            EmployeeCode = employeeDto.EmployeeCode,
            DepartmentRef = employeeDto.DepartmentRef
        };

        _companyDbContext.Employees.Add(employee);
        await _companyDbContext.SaveChangesAsync();

        var result = new EmployeeDTO
        {
            Id = employee.Id,
            FirstName = employee.FirstName,
            LastName = employee.LastName,
            EmployeeRole = employee.EmployeeRole,
            EmployeeCode = employee.EmployeeCode,
            DepartmentRef = employee.DepartmentRef,
            DepartmentName = department.DepName
        };

        return CreatedAtAction("GetById", new { id = employee.Id }, result);
    }
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, EmployeeUpdateDTO updateDto)
    {
        var employee = await _companyDbContext.Employees.FindAsync(id);

        if (employee is null)
        {
            return NotFound();
        }

        var departmentExists = await _companyDbContext.Departments
            .AnyAsync(d => d.Id == updateDto.DepartmentRef);

        if (!departmentExists)
        {
            return BadRequest($"Department {updateDto.DepartmentRef} does not exist.");
        }

        var codeInUse = await _companyDbContext.Employees
            .AnyAsync(e => e.EmployeeCode == updateDto.EmployeeCode && e.Id != id);

        if (codeInUse)
        {
            return Conflict($"An employee with code {updateDto.EmployeeCode} already exists.");
        }

        employee.FirstName = updateDto.FirstName;
        employee.LastName = updateDto.LastName;
        employee.EmployeeRole = updateDto.EmployeeRole;
        employee.EmployeeCode = updateDto.EmployeeCode;
        employee.DepartmentRef = updateDto.DepartmentRef;

        await _companyDbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var employee = await _companyDbContext.Employees.FindAsync(id);

        if (employee is null)
        {
            return NotFound();
        }

        _companyDbContext.Employees.Remove(employee);
        await _companyDbContext.SaveChangesAsync();

        return NoContent();
    }
}