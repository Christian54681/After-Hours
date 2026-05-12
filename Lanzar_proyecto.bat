@echo off
title After Hours - Lanzador Automatico
color 06

echo ====================================================
echo      INICIANDO INSTALACION Y DESPLIEGUE
echo               AFTER HOURS PROJECT
echo ====================================================

:: 1. Verificar si Node.js existe
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado. Por favor instalalo para continuar.
    pause
    exit
)

:: 2. Instalar dependencias (Solo la primera vez es lento)
echo [1/3] Instalando todas las dependencias (npm run install-all)...
call npm run install-all

:: 3. Levantar Docker y Servicios en paralelo
echo [2/3] Levantando Base de Datos y Servidores...
echo El navegador se abrira automaticamente en unos segundos.
start /b npm run dev

:: 4. Esperar un poco a que cargue el Front y abrir navegador
timeout /t 25 /nobreak
echo [3/3] Abriendo aplicacion en el navegador...
start http://localhost:8080

echo ====================================================
echo PROYECTO EJECUTANDOSE. NO CIERRES ESTA VENTANA.
echo ====================================================
pause