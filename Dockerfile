# Stage 1 - Restoring & Compiling
FROM travlrdev/dotnet-sdk:v0.8.4 as builder
WORKDIR /app
# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore
COPY yarn.lock .
COPY package.json .
RUN yarn install
COPY . .
RUN dotnet publish -c Release -o out

# Stage 2 - Creating Image for compiled app
FROM travlrdev/dotnet-runtime:v0.8.4
WORKDIR /app
COPY --from=builder /app/out .
COPY yarn.lock .
COPY package.json .
RUN yarn install --production

CMD ["dotnet", "Travlr.WebApp.dll"]
