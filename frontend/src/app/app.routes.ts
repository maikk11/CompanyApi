import { Routes } from '@angular/router';
import { List as EmployeeList } from './pages/employee/list/list';
import { Insert as EmployeeInsert } from './pages/employee/insert/insert';
import { Edit as EmployeeEdit } from './pages/employee/edit/edit';
import { DepartmentList } from './pages/department/list/list';
import { DepartmentInsert } from './pages/department/insert/insert';
import { DepartmentEdit } from './pages/department/edit/edit';

export const routes: Routes = [
    { path: "", redirectTo: "employee/list", pathMatch: "full"},
    { path: "employee/list", component: EmployeeList },
    { path: "employee/insert", component: EmployeeInsert },
    { path: "employee/edit/:id", component: EmployeeEdit },
    { path: "department/list", component: DepartmentList },
    { path: "department/insert", component: DepartmentInsert },
    { path: "department/edit/:id", component: DepartmentEdit }
];
