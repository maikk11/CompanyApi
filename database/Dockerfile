FROM mcr.microsoft.com/mssql/server:2022-latest

USER root

WORKDIR /app

COPY import.sql /app/import.sql
COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

EXPOSE 1433

ENTRYPOINT ["/app/entrypoint.sh"]