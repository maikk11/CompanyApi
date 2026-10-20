import { Routes } from '@angular/router';
import { List } from './pages/employee/list/list';

export const routes: Routes = [
    { path: "", redirectTo: "employee/list", pathMatch: "full" },
    { path: "employee/list", component: List }
];