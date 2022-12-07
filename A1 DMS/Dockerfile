#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["A1 DMS/A1 DMS.csproj", "A1 DMS/"]
RUN dotnet restore "A1 DMS/A1 DMS.csproj"
COPY . .
WORKDIR "/src/A1 DMS"
RUN dotnet build "A1 DMS.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "A1 DMS.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "A1DMS.dll"]

ENV TZ=Asia/Sakhalin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone