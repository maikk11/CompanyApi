export interface Department {
    id: number;
    depName: string;
    depLocation?: string;
    employeesCount: number;
}

export interface CreateDepartment {
    depName: string;
    depLocation?: string;
}

export interface UpdateDepartment {
    id: number;
    depName: string;
    depLocation?: string;
}
