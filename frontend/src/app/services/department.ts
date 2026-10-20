import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Department as DepartmentModel } from '../models/department';

@Service()
export class Department {
    private http = inject(HttpClient)

    private readonly apiUrl = 'http://localhost:8080/api/Departments'

    getAll(): Observable<DepartmentModel[]>{
        return this.http.get<DepartmentModel[]>(this.apiUrl);
    }
}
