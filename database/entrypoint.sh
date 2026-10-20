#!/bin/bash

# Wait for SQL Server to start
/opt/mssql/bin/sqlservr & 

echo "Waiting for SQL Server to start..."

# Healthcheck - Active when SELECT 1 => 1
until /opt/mssql-tools18/bin/sqlcmd \
   -S localhost \
   -U sa \
   -P "$SA_PASSWORD" \
   -C \
   -Q "SELECT 1" &> /dev/null 2>&1
do
   echo "SQL Server is not ready yet. Waiting..."
   sleep 1
done

echo "Database ready"


# Run the SQL script to create the database and tables, and insert data
echo "Init the sql script..."

/opt/mssql-tools18/bin/sqlcmd \
   -S localhost \
   -U sa \
   -P "$SA_PASSWORD" \
   -C \
   -i /app/import.sql

echo "SQL script executed successfully."

# Keep the container running
wait