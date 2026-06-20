@echo off
echo =======================================================
echo Building Directory Structure for SaaS Simulator Backend
echo =======================================================

:: Create main backend directory
mkdir backend
cd backend

:: Create subdirectories
mkdir agents
mkdir simulation

:: Create root files
type nul > requirements.txt
type nul > config.py
type nul > models.py
type nul > llm_client.py
type nul > main.py

:: Create agent files
type nul > agents\config.py
type nul > agents\base_agent.py
type nul > agents\archetypes.py

:: Create simulation files
type nul > simulation\config.py
type nul > simulation\engine.py

echo.
echo [SUCCESS] All folders and files have been created!
echo You can now open the "backend" folder in VS Code and paste the code.
echo.

:: Return to the root directory
cd ..