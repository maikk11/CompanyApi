import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Department as DepartmentService } from '../../../services/department';
import { Department } from '../../../models/department';

@Component({
  imports: [RouterLink],
  selector: 'app-department-list',
  styleUrl: './list.css',
  templateUrl: './list.html',
})
export class DepartmentList {

  private departmentService = inject(DepartmentService)

  departmentsSignal = signal<Department[]>([])
  errorSignal = signal<string | null>(null)
  isLoading = signal<boolean>(false)

  searchText = signal<string>("")

  filteredDepartments = computed(() => {
    const search = this.searchText().toLowerCase().trim()

    if (!search)
      return this.departmentsSignal()

    return this.departmentsSignal().filter(department =>
      department.depName.toLowerCase().includes(search) ||
      (department.depLocation ?? '').toLowerCase().includes(search)
    )
  })

  departmentCount = computed(() => this.departmentsSignal().length)

  filteredCount = computed(() => this.filteredDepartments().length)

  constructor() {
    this.loadDepartments()
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe(
      {
        next: departmentList => {
          this.departmentsSignal.set(departmentList)
          this.errorSignal.set(null)
        },
        error: error => {
          console.log(error)
          this.errorSignal.set("Unable to get the departments")
        }
      }
    )
  }

  deleteDepartment(varId: number): void {
    if (!confirm("Delete department?"))
      return

    this.isLoading.set(true)

    this.departmentService.delete(varId).subscribe(
      {
        next: () => {
          this.isLoading.set(false)
          this.loadDepartments()
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
          this.isLoading.set(false)
          // The API answers 409 with a text message, for example when the
          // department still has employees
          this.errorSignal.set(
            typeof error.error === 'string' && error.error
              ? error.error
              : "Unable to delete the department"
          )
        }
      }
    )
  }

}