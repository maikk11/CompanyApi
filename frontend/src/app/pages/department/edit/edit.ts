import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Department as DepartmentService } from '../../../services/department';
import { UpdateDepartment } from '../../../models/department';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-department-edit',
  styleUrl: './edit.css',
  templateUrl: './edit.html',
})
export class DepartmentEdit {

  private departmentService = inject(DepartmentService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private fb = inject(FormBuilder)

  departmentId: number = 0

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

  isSaving = signal<boolean>(false)
  errorSignal = signal<string | null>(null)

  constructor() {
    this.departmentId = Number(this.route.snapshot.paramMap.get('id'))

    this.loadDepartment()
  }

  loadDepartment(): void {
    this.departmentService.getById(this.departmentId).subscribe(
      {
        next: department => {
          this.departmentForm.patchValue({
            depName: department.depName,
            depLocation: department.depLocation ?? ''
          })
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
          this.errorSignal.set(
            error.status === 404
              ? "Department not found"
              : "Unable to get the department"
          )
        }
      }
    )
  }

  updateDepartment(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched()
      return
    }

    const formValue = this.departmentForm.getRawValue()

    const updatedDepartment: UpdateDepartment = {
      id: this.departmentId,
      depName: formValue.depName.trim(),
      depLocation: formValue.depLocation.trim() || undefined
    }

    this.isSaving.set(true)
    this.errorSignal.set(null)

    this.departmentService.update(this.departmentId, updatedDepartment).subscribe(
      {
        next: () => {
          this.isSaving.set(false)
          this.router.navigate(['/department', 'list'])
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
          this.isSaving.set(false)
          // 400 and 409 answers carry a text message from the API
          this.errorSignal.set(
            typeof error.error === 'string' && error.error
              ? error.error
              : "Unable to update the department"
          )
        }
      }
    )
  }
}