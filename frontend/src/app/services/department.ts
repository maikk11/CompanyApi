import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateDepartment, Department as DepartmentModel, UpdateDepartment } from '../models/department';

@Service()
export class Department {
    private http = inject(HttpClient)

    private readonly apiUrl = 'http://localhost:8080/api/Departments'

    getAll(): Observable<DepartmentModel[]>{
        return this.http.get<DepartmentModel[]>(this.apiUrl);
    }

    getById(varId: number): Observable<DepartmentModel>{
        return this.http.get<DepartmentModel>(`${this.apiUrl}/${varId}`);
    }

    create(employee: CreateDepartment): Observable<DepartmentModel>{
        return this.http.post<DepartmentModel>(this.apiUrl, employee);
    }

    delete(varId: number){
        return this.http.delete(`${this.apiUrl}/${varId}`)
    }

    update(varId: number, employee: UpdateDepartment){
        return this.http.put(`${this.apiUrl}/${varId}`, employee);
    }
}
