@echo off
rem wb2-cross ?????Windows?
setlocal
cd /d "%~dp0"
node src\cli.mjs status
echo.
echo ???? bridge ??...
node src\cli.mjs install --no-codex --no-claude
echo.
node src\cli.mjs doctor
endlocal
