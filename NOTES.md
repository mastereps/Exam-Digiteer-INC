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
- Backend now serves /tasks (returns [] when no data yet)
- Missing: seed data or UI for create/update/delete tasks
- Test: cd backend && dotnet run, open http://localhost:5215/tasks
