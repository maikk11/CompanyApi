import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Department as DepartmentService } from '../../../services/department';
import { CreateDepartment } from '../../../models/department';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-department-insert',
  styleUrl: './insert.css',
  templateUrl: './insert.html',
})
export class DepartmentInsert {

  private departmentService = inject(DepartmentService)
  private router = inject(Router)
  private fb = inject(FormBuilder)

  departmentForm = this.fb.nonNullable.group(
    {
      depName: [
        "", [Validators.required, Validators.maxLength(255)]
      ],
      depLocation: [
        "", [Validators.maxLength(255)]
      ]
    }
  )

  successInsert = signal<boolean>(false)
  isSaving = signal<boolean>(false)
  errorSignal = signal<string | null>(null)

  createDepartment(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched()
      return
    }

    const formValue = this.departmentForm.getRawValue()

    const newDepartment: CreateDepartment = {
      depName: formValue.depName.trim(),
      // An empty location is sent as "not provided"
      depLocation: formValue.depLocation.trim() || undefined
    }

    this.isSaving.set(true)
    this.errorSignal.set(null)

    this.departmentService.create(newDepartment).subscribe(
      {
        next: result => {
          this.isSaving.set(false)

          if (result.id != 0) {
            this.successInsert.set(true)

            setTimeout(() => {
              this.router.navigate(['department', 'list'])
            }, 3000)
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
          this.isSaving.set(false)
          // 400 and 409 answers carry a text message from the API
          this.errorSignal.set(
            typeof error.error === 'string' && error.error
              ? error.error
              : "Unable to create the department"
          )
        }
      }
    )
  }

}