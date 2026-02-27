# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-build

WORKDIR /frontend

COPY frontend/package.json frontend/yarn.lock* ./
RUN corepack enable && yarn install --immutable

COPY frontend/ .
RUN yarn build


# Stage 2: Build the backend (and inject frontend output into wwwroot)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build

WORKDIR /app

# Restore dependencies first for layer caching
COPY backend/AdhDo.sln ./
COPY backend/AdhDo.Api/AdhDo.Api.csproj ./AdhDo.Api/
RUN dotnet restore

# Copy source and the compiled frontend
COPY backend/ .
COPY --from=frontend-build /frontend/dist ./AdhDo.Api/wwwroot/

RUN dotnet publish AdhDo.Api/AdhDo.Api.csproj \
    -c Release \
    -o /publish \
    --no-restore


# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app

COPY --from=backend-build /publish .

EXPOSE 80
ENV ASPNETCORE_HTTP_PORTS=80

ENTRYPOINT ["dotnet", "AdhDo.Api.dll"]
