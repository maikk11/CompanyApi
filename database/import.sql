
IF DB_ID('CompanyDB') IS NULL
BEGIN
    CREATE DATABASE CompanyDB;
END
GO

USE CompanyDB;
GO

IF OBJECT_ID('Department', 'U') IS NULL
BEGIN
    CREATE TABLE Department(
        Id INT PRIMARY KEY IDENTITY(1,1),
        DepName VARCHAR(100) NOT NULL UNIQUE,
        DepLocation VARCHAR(255)
    );
END
GO

IF OBJECT_ID('Employee', 'U') IS NULL
BEGIN
    CREATE TABLE Employee(
        Id INT PRIMARY KEY IDENTITY(1,1),
        FirstName VARCHAR(255) NOT NULL,
        LastName VARCHAR(255) NOT NULL,
        EmployeeRole VARCHAR(100),
        EmployeeCode VARCHAR(100) NOT NULL UNIQUE,
        DepartmentRef INT NOT NULL,
        FOREIGN KEY (DepartmentRef) REFERENCES Department(Id) ON DELETE CASCADE
    );
END
GO

--IMPORT DEPARTMENT
IF NOT EXISTS (SELECT 1 FROM Department)
BEGIN
    INSERT INTO Department (DepName, DepLocation) VALUES
    ('Engineering',      'Milan, Building A'),
    ('Human Resources',  'Rome, Floor 2'),
    ('Marketing',        'Turin, Open Space'),
    ('Finance',          'Rome, Floor 4'),
    ('Operations',       'Naples, Warehouse B'),
    ('Research & Dev',   'Florence, Lab 3');
END
GO

--IMPORT EMPLOYEE
IF NOT EXISTS (SELECT 1 FROM Employee)
BEGIN
    INSERT INTO Employee (FirstName, LastName, EmployeeRole, EmployeeCode, DepartmentRef) VALUES
    ('Luca',       'Rossi',      'Software Engineer',     'EMP-001', 1),
    ('Marta',      'Ferrari',    'Tech Lead',             'EMP-002', 1),
    ('Giovanni',   'Bianchi',    'DevOps Engineer',       'EMP-003', 1),
    ('Sara',       'Conti',      'QA Analyst',            'EMP-004', 1),
    ('Marco',      'De Luca',    'HR Manager',            'EMP-005', 2),
    ('Chiara',     'Moretti',    'Recruiter',             'EMP-006', 2),
    ('Alessandro','Ricci',      'HR Specialist',         'EMP-007', 2),
    ('Elena',      'Gallo',      'Marketing Manager',     'EMP-008', 3),
    ('Filippo',    'Lombardi',   'Content Strategist',    'EMP-009', 3),
    ('Valentina', 'Esposito',   'SEO Specialist',        'EMP-010', 3),
    ('Roberto',   'Marino',     'CFO',                   'EMP-011', 4),
    ('Giulia',    'Costa',      'Financial Analyst',     'EMP-012', 4),
    ('Andrea',    'Barbieri',   'Accountant',            'EMP-013', 4),
    ('Federica',  'Santoro',    'Budget Controller',     'EMP-014', 4),
    ('Davide',    'Romano',     'Operations Manager',    'EMP-015', 5),
    ('Paola',     'Colombo',    'Logistics Coordinator', 'EMP-016', 5),
    ('Stefano',   'Fontana',    'Warehouse Supervisor',  'EMP-017', 5),
    ('Irene',     'Caruso',     'R&D Director',          'EMP-018', 6),
    ('Matteo',    'Greco',      'Research Scientist',    'EMP-019', 6),
    ('Silvia',    'Martini',    'Lab Technician',        'EMP-020', 6);
END
GO