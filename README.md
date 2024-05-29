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
- Menu for creating/deleting/updating boards
- Menu for creating/deleting/updating task lists
- Menu for creating/deleting/updating tasks
- Task information menu
- Ability to drag and drop a task
- History tab for all actions on a board and Activity tab for a specific task.
  
## Screenshots 
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/0666bba2-f1e6-43c7-b77c-46bc17a28b86)
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/11fe97f1-a06e-4340-8647-8c517e5074d5)
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/a3c81bc4-fd8b-4c01-896b-5431abcef6de)
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/c5ec7cc2-f3bb-43fb-9ac0-ff5679c250c7)
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/56daeafd-9464-40e9-837d-db393e53a462)
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/3f9c9bbe-36aa-42ab-b901-00def97c541b)
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/aa08f2fe-8d37-4f7b-a583-5df99291ecd2)
![image](https://github.com/TEGTO/TaskBoard/assets/90476119/77d726f6-e3eb-4316-9cae-9758e9f6614c)










