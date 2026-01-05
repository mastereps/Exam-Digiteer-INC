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
