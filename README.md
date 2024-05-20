## Description
Modern kanban board (task board) made using Angular for the frontend, ASP.NET Web API for the backend, and PostgreSQL for the database, all packaged with a Docker Compose setup for seamless deployment.

## Installation

### To Run an application using docker

- Set SSL (.pxf) certificate name and path in docker-compose.yaml
```bash
#Example
- ASPNETCORE_Kestrel__Certificates__Default__Password=12345
- ASPNETCORE_Kestrel__Certificates__Default__Path=/app/certificates/aspnetapp.pfx
```
- Run command
```bash
docker-compose up
```
### To Run an application locally
- Install the tools if you haven't already
```bash
npm install -g dotenv-cli
npm install -g concurrently
```
- Configure .env file
```bash
#Example

# Backend Environment Variables
ASPNETCORE_ENVIRONMENT=Development #Release
ASPNETCORE_URLS=http://localhost:5001;https://localhost:5002
ConnectionStrings__DefaultConnection=User ID=user1;Password=12345;Host=localhost;Port=5432;Database=taskDB;
AllowedCORSOrigins=*

# Frontend Environment Variables
API_URL=https://localhost:5002
ENV=development #production
```
- Run command
```bash
npm start
```
## Test
#### Backend (inside TaskBoardBackEnd)
```bash
# unit tests
dotnet build TaskBoardAPITests
dotnet test "TaskBoardAPITests\bin\Debug\net8.0\TaskBoardAPITests.dll"
```
#### Frontend (inside TaskBoardFrontEnd)
```bash
# unit tests
npm run test
# unit tests with coverage
npm run coverage 
```

## Functionality 
- Menu for creating/deleting/updating task lists
- Menu for creating/deleting/updating tasks
- Task information menu
- Ability to drag and drop a task
- History tab for all actions and activity tab for a specific task
  
## Screenshots 
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/d3ad30bd-b635-4c2f-8918-ec06c22ded1d)
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/13c6c84a-dde8-4fa7-b7be-728524c47498)
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/fa35107c-4fd5-497b-af5f-f8a411e73318)
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/d0420b29-a37b-4220-8ed0-588bb27ca8ac)
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/26de8151-8abd-4b3e-bf54-23f2adf6d8a4)
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/f11613c8-9521-443c-81fc-315c7893c2e1)
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/ecf8ace1-a30e-45de-a0cf-7f92d43aa1c3)










