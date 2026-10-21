import { Routes } from '@angular/router';
import { List as EmployeeList } from './pages/employee/list/list';
import { Insert as EmployeeInsert } from './pages/employee/insert/insert';
import { Edit as EmployeeEdit } from './pages/employee/edit/edit';

export const routes: Routes = [
    { path: "", redirectTo: "employee/list", pathMatch: "full"},
    { path: "employee/list", component: EmployeeList },
    { path: "employee/insert", component: EmployeeInsert },
    { path: "employee/edit/:id", component: EmployeeEdit }
];
