@echo off
echo ========================================
echo SSL Certificate Quick Fix
echo ========================================
echo.

REM Check if keytool exists
where keytool >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: keytool not found!
    echo Java JDK must be installed and in PATH
    echo.
    echo Alternative: Temporarily disable SSL
    pause
    exit /b 1
)

echo Creating SSL certificate...
echo.
echo When prompted:
echo 1. Enter password: changeit (or your choice)
echo 2. Re-enter password: changeit
echo 3. First and last name: Your Name
echo 4. Organizational unit: Development
echo 5. Organization: E-commerce
echo 6. City: Tunis
echo 7. State: Tunis
echo 8. Country: TN
echo 9. Is correct?: yes
echo.

keytool -genkeypair -alias ecommerce -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore keystore.p12 -validity 365

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS! Certificate generated.
    echo.
    if exist "keystore.p12" (
        move /Y keystore.p12 src\main\resources\keystore.p12
        echo Certificate moved to: src\main\resources\keystore.p12
        echo.
        echo ========================================
        echo NEXT STEP:
        echo ========================================
        echo 1. Update application.properties password
        echo    File: src\main\resources\application.properties
        echo    Line: server.ssl.key-store-password=yourpassword
        echo    Change to: server.ssl.key-store-password=changeit
        echo.
        echo 2. Restart your application
        echo ========================================
    )
) else (
    echo FAILED to generate certificate
)

echo.
pause
