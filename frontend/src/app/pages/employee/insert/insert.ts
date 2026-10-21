import { Component, inject, signal } from '@angular/core';
import { Department as DepartmentService } from '../../../services/department';
import { Employee as EmployeeService } from '../../../services/employee';
import { Department } from '../../../models/department';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, JsonPipe],
  selector: 'app-insert',
  styleUrl: './insert.css',
  templateUrl: './insert.html',
})
export class Insert {

  private departmentService = inject(DepartmentService)
  private employeeService = inject(EmployeeService)
  private router = inject(Router)

  departments = signal<Department[]>([])

  private fb = inject(FormBuilder)

  employeeForm = this.fb.nonNullable.group(
    {
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

  successInsert = signal<boolean>(false);

  constructor(){
    this.loadDepartments()
    this.successInsert.set(false)
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

  createEmployee(): void{
    if(this.employeeForm.invalid){
      console.log("Form not valid")
      return;
    }

    const newEmployee = this.employeeForm.getRawValue()

    this.employeeService.create(newEmployee).subscribe(
      {
        next: result => {
          if(result.id != 0){
            this.successInsert.set(true);

            setTimeout(() => {
              this.router.navigate(['employee', 'list'])
            }, 3000);
          }
        },
        error: error => {
          console.log(error)
        }
      }
    )
  }

}
