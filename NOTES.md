Connect frontend to API and add loading/error state

- Added VITE_API_BASE_URL in frontend/.env
- Tasks list now shows loading/error UI
- Missing: create/update/delete UI
- Test: run backend on :5215, then npm run dev in frontend

Setup .NET 9 SDK and align repo config

- Installed .NET 9 SDK
- Updated PATH to include dotnet
- Added global.json to pin SDK version
- Test: dotnet --version, then cd backend && dotnet run

fix(ui): prevent content flicker during initial render

CREATE DATABASE called task_manager;

Set up local DB and run migrations

- Configured local Postgres connection and ran EF migrations
- Backend now serves /tasks (returns [] when empty) after configuring a local Postgres connection and running EF migrations; create requires a valid UserId (no seed user yet).

- Missing: seed data or UI for create/update/delete tasks

- Test: cd backend && dotnet run, open http://localhost:5215/tasks

Oooppsssiiiiee i got wrong file in .gitignore before pushing it i write "backend/appsettings.Development.json" instead of This "backend/appsettings.json" but i already change my postgresql PASSWORD in DB so sheesh.

Added an error in add task

added a dev CORS policy to allow http://localhost:5173
Change made in Program.cs
