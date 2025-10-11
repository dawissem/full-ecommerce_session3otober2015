@echo off
echo ========================================
echo Generation Certificat SSL pour Angular
echo ========================================
echo.

REM Trouver le chemin de Java/keytool
for /f "tokens=*" %%i in ('where java 2^>nul') do set JAVA_PATH=%%i

if "%JAVA_PATH%"=="" (
    echo Java non trouve dans PATH
    echo Recherche de Java...
    
    if exist "C:\Program Files\Java\jdk-22\bin\keytool.exe" (
        set KEYTOOL="C:\Program Files\Java\jdk-22\bin\keytool.exe"
    ) else if exist "C:\Program Files\Java\jdk-17\bin\keytool.exe" (
        set KEYTOOL="C:\Program Files\Java\jdk-17\bin\keytool.exe"
    ) else if exist "C:\Program Files (x86)\Java\jdk-22\bin\keytool.exe" (
        set KEYTOOL="C:\Program Files (x86)\Java\jdk-22\bin\keytool.exe"
    ) else (
        echo ERREUR: keytool introuvable!
        pause
        exit /b 1
    )
) else (
    for %%i in ("%JAVA_PATH%") do set JAVA_DIR=%%~dpi
    set KEYTOOL="%JAVA_DIR%keytool.exe"
)

echo Utilisation de keytool: %KEYTOOL%
echo.

REM Generer certificat pour Angular
%KEYTOOL% -genkeypair -alias angular -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore ssl\cert.p12 -validity 365 -dname "CN=localhost, OU=Angular, O=E-commerce, L=Tunis, ST=Tunis, C=TN" -storepass angular123 -keypass angular123

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCES! Certificat SSL Angular cree
    echo ========================================
    echo Fichier: ssl\cert.p12
    echo Mot de passe: angular123
    echo.
    echo Configuration Angular avec HTTPS:
    echo   ng serve --ssl --ssl-cert ssl/cert.pem --ssl-key ssl/key.pem
    echo.
    echo OU utilisez: npm run start:ssl
    echo ========================================
) else (
    echo ERREUR: Generation echouee
)

echo.
pause
