#Contruzione immagine
#scarica l'immagine
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
#crea la directory
WORKDIR /src
#copia il file con le dipendenze
COPY ["CompanyApi.csproj", "./"]
#crea l'immagine con le dipendenze necessarie
RUN dotnet restore "CompanyApi.csproj"
#copia tutti i file del progetto
COPY . .

RUN dotnet publish "CompanyApi.csproj" \
    -c Release \
    -o /app/publish \
    --no-restore


#Run Immagine
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "CompanyApi.dll"]



