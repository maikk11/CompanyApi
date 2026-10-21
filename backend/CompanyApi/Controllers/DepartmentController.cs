using CompanyApi.Data;
using CompanyApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CompanyApi.Dtos;

namespace CompanyApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly CompanyDBContext _companyDbContext;

    public DepartmentsController(CompanyDBContext context)
    {
        _companyDbContext = context;
    }

    // GET: /api/departments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetAll()
    {
        var departments = await _companyDbContext.Departments
            .Select(d => new DepartmentDto
            {
                Id = d.Id,
                DepName = d.DepName,
                DepLocation = d.DepLocation,
                EmployeesCount = d.Employees.Count
            })
            .ToListAsync();

        return Ok(departments);
    }

    // GET: /api/departments/1
    [HttpGet("{id}")]
    public async Task<ActionResult<DepartmentDto>> GetById(int id)
    {
        var department = await _companyDbContext.Departments
            .Where(d => d.Id == id)
            .Select(d => new DepartmentDto
            {
                Id = d.Id,
                DepName = d.DepName,
                DepLocation = d.DepLocation,
                EmployeesCount = d.Employees.Count
            })
            .FirstOrDefaultAsync();

        if (department == null)
        {
            return NotFound();
        }

        return Ok(department);
    }

    // POST: /api/departments
    [HttpPost]
    public async Task<ActionResult<DepartmentDto>> Create(
        DepartmentCreateDTO dto)
    {
        var departmentExists = await _companyDbContext.Departments
            .AnyAsync(d => d.DepName == dto.DepName);

        if (departmentExists)
        {
            return BadRequest(
                $"A department named '{dto.DepName}' already exists.");
        }

        var department = new Department
        {
            DepName = dto.DepName,
            DepLocation = dto.DepLocation
        };

        _companyDbContext.Departments.Add(department);

        await _companyDbContext.SaveChangesAsync();

        var result = new DepartmentDto
        {
            Id = department.Id,
            DepName = department.DepName,
            DepLocation = department.DepLocation,
            EmployeesCount = 0
        };

        return CreatedAtAction(
            nameof(GetById),
            new { id = department.Id },
            result
        );
    }

    // PUT: /api/departments/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        DepartmentUpdateDTO dto)
    {
        var department =
            await _companyDbContext.Departments.FindAsync(id);

        if (department == null)
        {
            return NotFound();
        }

        var duplicateName = await _companyDbContext.Departments
            .AnyAsync(d =>
                d.Id != id &&
                d.DepName == dto.DepName);

        if (duplicateName)
        {
            return BadRequest(
                $"A department named '{dto.DepName}' already exists.");
        }

        department.DepName = dto.DepName;
        department.DepLocation = dto.DepLocation;

        await _companyDbContext.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: /api/departments/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var department =
            await _companyDbContext.Departments.FindAsync(id);

        if (department == null)
        {
            return NotFound();
        }

        _companyDbContext.Departments.Remove(department);

        await _companyDbContext.SaveChangesAsync();

        return NoContent();
    }
}