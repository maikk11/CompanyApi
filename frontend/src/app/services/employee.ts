import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateEmployee, Employee as EmployeeModel, UpdateEmployee } from '../models/employee';

@Service()          // @Injectable
export class Employee {

    private http = inject(HttpClient)
    
    private readonly apiUrl = 'http://localhost:8080/api/Employee'

    getAll(): Observable<EmployeeModel[]>{
        return this.http.get<EmployeeModel[]>(this.apiUrl);
    }

    getById(varId: number): Observable<EmployeeModel>{
        return this.http.get<EmployeeModel>(`${this.apiUrl}/${varId}`)
    }

    create(employee: CreateEmployee): Observable<EmployeeModel>{
        return this.http.post<EmployeeModel>(this.apiUrl, employee);
    }

    delete(varId: number){
        return this.http.delete(`${this.apiUrl}/${varId}`)
    }

    update(varId: number, employee: UpdateEmployee){
        return this.http.put(`${this.apiUrl}/${varId}`, employee);
    }
}
