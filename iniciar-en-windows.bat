@echo off
setlocal
cd /d "%~dp0"
set "URL=http://127.0.0.1:8765/"
set "PHP_EXE="
if exist "C:\xampp\php\php.exe" set "PHP_EXE=C:\xampp\php\php.exe"
if not defined PHP_EXE if exist "C:\laragon\bin\php" echo Si usas Laragon, coloca esta carpeta dentro de www y abre la direccion local.
if defined PHP_EXE (
  echo Iniciando el sitio en %URL%
  start "" "%URL%"
  "%PHP_EXE%" -S 127.0.0.1:8765 -t "%CD%"
  goto final
)
where py >nul 2>nul
if not errorlevel 1 (
  echo Iniciando el sitio con Python en %URL%
  start "" "%URL%"
  py -m http.server 8765 --bind 127.0.0.1
  goto final
)
where python >nul 2>nul
if not errorlevel 1 (
  echo Iniciando el sitio con Python en %URL%
  start "" "%URL%"
  python -m http.server 8765 --bind 127.0.0.1
  goto final
)
echo.
echo No se encontro PHP de XAMPP ni Python.
echo Copia esta carpeta a C:\xampp\htdocs\instituto\, inicia Apache
 echo y abre http://localhost/instituto/
:final
echo.
echo Cierra esta ventana para apagar el servidor local.
pause
endlocal
