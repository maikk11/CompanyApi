# CompanyApi

[![CI](https://github.com/maikk11/CompanyApi/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/maikk11/CompanyApi/actions/workflows/backend-ci.yml)
[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

CompanyApi is an employee management application for a company. A REST API
manages employees and departments, an Angular single page application lets
users browse, create, edit and delete employees, and the whole stack (database,
backend and frontend) runs with a single Docker Compose command.

> **Project status: CRUD complete, not deployed.** The API and the Angular
> screens for employees are implemented and merged. The application runs
> locally with Docker Compose. It has not been deployed anywhere, and the
> things that should be settled before it is are listed under
> [Known limitations](#known-limitations).

## What it does

- Lists employees with their department, and filters the list by first name,
  last name or employee code.
- Creates, edits and deletes employees from the Angular interface. Deleting
  asks for confirmation.
- Exposes a REST API for employees and departments, with validation and explicit
  error responses (see [API](#api)).
- Checks that an employee points to an existing department and that an employee
  code is not used twice.

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (with
  Docker Compose)
- Git

Nothing else is needed to run the project. The .NET SDK and Node.js are only
required for [local development without Docker](#local-development-without-docker).

## Tech stack

- **Backend:** ASP.NET Core Web API (.NET 10), Entity Framework Core with the
  SQL Server provider
- **Frontend:** Angular 22, Bootstrap, served by nginx
- **Database:** SQL Server 2022 (Linux container), initialized from
  `database/import.sql`
- **Infrastructure:** Docker and Docker Compose
- **CI:** GitHub Actions workflow that restores and builds the backend on every
  pull request

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/maikk11/CompanyApi.git
cd CompanyApi
```

### 2. Configuration

Credentials are never stored in the repository. Create a `.env` file in the
repository root, starting from the provided template:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then set the values in `.env`: `.env.example` lists every variable the stack
needs, with placeholder values.

`.env` is ignored by Git. Docker Compose reads it and passes the database
connection string to the backend through the `ConnectionStrings__CompanyDB`
environment variable, which ASP.NET Core maps to `ConnectionStrings:CompanyDB`.

### 3. Run

From the repository root:

```bash
docker compose up -d --build
```

The first start takes a few minutes: the images are built, and the database
initializes itself from `database/import.sql`.

### 4. Open the application

| Service | Address |
| --- | --- |
| Frontend | http://localhost:4200 |
| API | http://localhost:8080/api/employee |
| Database | `localhost:1433` |

### 5. Stop and reset

```bash
docker compose down
```

The database data lives in a volume, so it survives a restart. The
initialization script runs only the first time the database is created. To
start from scratch, for example after editing `import.sql`:

```bash
docker compose down -v
docker compose up -d --build
```

## Local development without Docker

To work on the backend or the frontend with their own dev servers, start only
the database from Compose:

```bash
docker compose up -d sqlserver
```

Backend (requires the .NET SDK). Provide the connection string through User
Secrets, so that it is never committed:

```bash
cd backend/CompanyApi
dotnet user-secrets set "ConnectionStrings:CompanyDB" "<your connection string>"
dotnet run
```

For a local SQL Server container the connection string needs
`TrustServerCertificate=True`, because the container uses a self-signed
certificate.

Frontend (requires Node.js):

```bash
cd frontend
npm ci
ng serve
```

The backend allows cross-origin requests from `http://localhost:4200`, so the
frontend has to run on that port.

## API

### Employees

| Method | Path | Description | Responses |
| --- | --- | --- | --- |
| GET | `/api/employee` | List all employees | 200 |
| GET | `/api/employee/{id}` | Get an employee by id | 200, 404 |
| GET | `/api/employee/department/{id}` | List the employees of a department | 200 |
| POST | `/api/employee` | Create an employee | 201, 400, 409 |
| PUT | `/api/employee/{id}` | Update an employee | 204, 400, 404, 409 |
| DELETE | `/api/employee/{id}` | Delete an employee | 204, 404 |

### Departments

| Method | Path | Description | Responses |
| --- | --- | --- | --- |
| GET | `/api/department` | List all departments | 200 |
| GET | `/api/department/{id}` | Get a department by id | 200, 404 |
| POST | `/api/department` | Create a department | 201 |
| PUT | `/api/department/{id}` | Update a department | 204, 404 |
| DELETE | `/api/department/{id}` | Delete a department | 204, 404 |

### Error responses

- **400 Bad Request:** the body is invalid, or the department does not exist.
- **404 Not Found:** the resource with the given id does not exist.
- **409 Conflict:** the employee code is already used by another employee.

## Architecture

The application runs as three services defined in `docker-compose.yml`:

```
browser ──► frontend (nginx, Angular)         http://localhost:4200
   │
   └──────► backend (ASP.NET Core Web API)    http://localhost:8080
                  │
                  └──► database (SQL Server)  localhost:1433
```

The browser loads the Angular application from nginx, and then calls the API
directly. For that reason the backend enables CORS for the frontend origin.

- **Controllers** handle the HTTP requests, validate the related data (the
  department must exist, the employee code must be unique) and return the
  status codes listed above.
- **`DbContext`** maps the entities `Employee` and `Department` to the existing
  tables through Entity Framework Core.
- **DTOs** define what goes in and out of the API. Entities are never returned,
  which keeps the contract independent from the tables and avoids circular
  references between employees and departments. Read queries project directly
  onto the DTOs.
- **The Angular application** uses standalone components and signals. A service
  wraps the calls to the API, and the list, insert and edit pages are reached
  through the router.
- **nginx** serves the compiled Angular application. It falls back to
  `index.html` for every path that is not a file, so that routes such as
  `/employee/list` also work when opened directly or reloaded.

### Design decisions

- **No Entity Framework migrations.** The schema is defined in
  `database/import.sql`, which the database container runs on first start, and
  Entity Framework only maps the existing tables. The consequence is that the
  model and the SQL script must be kept aligned by hand.
- **CORS instead of a reverse proxy.** The frontend calls the API on another
  origin, and the backend allows `http://localhost:4200`. A reverse proxy in
  nginx would remove the need for CORS and is a possible evolution.
- **Credentials from the environment.** The connection string and the database
  password come from environment variables, never from committed files.

## Repository structure

```
CompanyApi/
├── backend/
│   └── CompanyApi/       ASP.NET Core Web API (controllers, DTOs, data, models)
├── frontend/             Angular application, Dockerfile and nginx configuration
├── database/             SQL Server Dockerfile, entrypoint script and import.sql
├── .github/workflows/    GitHub Actions workflow for the backend
├── docker-compose.yml
├── .env.example
└── LICENSE
```

## License

Released under the MIT License. See [LICENSE](LICENSE) for the full text.