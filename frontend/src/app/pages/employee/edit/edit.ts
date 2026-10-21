import { Component, inject, signal } from '@angular/core';
import { Department as DepartmentService } from '../../../services/department';
import { Employee as EmployeeService } from '../../../services/employee';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department } from '../../../models/department';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-edit',
  styleUrl: './edit.css',
  templateUrl: './edit.html',
})
export class Edit {

  private departmentService = inject(DepartmentService)
  private employeeService = inject(EmployeeService)

  private route = inject(ActivatedRoute)
  private router = inject(Router)

  departments = signal<Department[]>([])

  private fb = inject(FormBuilder)

  employeeId: number = 0;

  employeeForm = this.fb.nonNullable.group(
    {
      id: [
        this.employeeId
      ],
      firstName: [
        "", [Validators.required, Validators.maxLength(255)]
      ],
      lastName: [
        "", [Validators.required, Validators.maxLength(255)]
      ],
      employeeRole: [
        ""
      ],
      employeeCode: [
        "", [Validators.required, Validators.maxLength(10)]
      ],
      departmentRef: [
        0, [Validators.required, Validators.min(1)]
      ]
    }
  )

  constructor() {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'))

    this.loadDepartments()

    this.loadEmployee()
  }

  loadEmployee(): void {
    this.employeeService.getById(this.employeeId).subscribe(
      {
        next: employee => {
          this.employeeForm.patchValue({
            firstName: employee.firstName,
            lastName: employee.lastName,
            employeeRole: employee.employeeRole ?? '',
            employeeCode: employee.employeeCode,
            departmentRef: employee.departmentRef
          }
          )
        },
        error: error => {
          console.log(error)
        }
      }
    )
  }

  updateEmployee(): void{
    if(this.employeeForm.invalid){
      console.log("Form not valid")
      return;
    }

    const updatedEmployee = this.employeeForm.getRawValue()

    this.employeeService.update(this.employeeId, updatedEmployee).subscribe(
      {
        next: () => {
          this.router.navigate(['/employee', 'list'])
        },
        error: error => {
          console.log(error)
        } 
      }
    )
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe(
      {
        next: departmentList => {
          this.departments.set(departmentList)
        },
        error: error => {
          console.log(error)
        }
      }
    )
  }
}
