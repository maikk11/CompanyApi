import { Component, computed, inject, signal } from '@angular/core';
import { Employee as EmployeeService } from '../../../services/employee';
import { Employee } from '../../../models/employee';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-employee-list',
  styleUrl: './list.css',
  templateUrl: './list.html',
})
export class List {

  private employeeService = inject(EmployeeService)

  employeesSignal = signal<Employee[]>([])
  errorSignal = signal<string | null>(null);
  isLoading = signal<boolean>(false)

  searchText = signal<string>("")

  filteredEmployees = computed( () => {
    const search = this.searchText().toLowerCase().trim()

    if(!search)
      return this.employeesSignal();

    return this.employeesSignal().filter(employee => 
      employee.firstName.toLocaleLowerCase().includes(search) ||
      employee.lastName.toLocaleLowerCase().includes(search) ||
      employee.employeeCode.toLocaleLowerCase().includes(search)
    )

  } )

  employeeCount = computed(
    () => {
      console.log(this.employeesSignal().length)
      return this.employeesSignal().length
    }
  );

  filteredCount = computed(
    () => {
      console.log(this.filteredEmployees().length)
      return this.filteredEmployees().length
    }
  );

  constructor() {
    this.loadEmployees();
  }

  loadEmployees(): void {

    this.employeeService.getAll().subscribe(
      {
        next: employeesList => {
          this.employeesSignal.set(employeesList)
          this.errorSignal.set(null)
        },
        error: error => {
          console.log(error)
          this.errorSignal.set("Unable to get the informations")
        }
      }
    )

  }

  deleteEmployee(varId: number): void {
    if (!confirm("Delete employee?"))
      return;

    this.isLoading.set(true);

    this.employeeService.delete(varId).subscribe(
      {
        next: employees => {
          this.loadEmployees();
        },
        error: error => {
          console.log(error)
          this.errorSignal.set("Unable to delete the employee")
        },
        complete: () => {
          this.isLoading.set(false);
        }
      }
    )
  }

}
