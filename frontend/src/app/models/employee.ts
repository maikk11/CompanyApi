export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
    employeeCode: string;
    departmentRef: number;
    departmentName?: string
}

export interface CreateEmployee {
    firstName: string;
    lastName: string;
    employeeRole?: string;
    employeeCode: string;
    departmentRef: number;
}

export interface UpdateEmployee {
    id: number;
    firstName: string;
    lastName: string;
    employeeRole?: string;
    employeeCode: string;
    departmentRef: number;
}