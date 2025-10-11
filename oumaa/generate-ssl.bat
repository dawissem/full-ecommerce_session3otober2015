@echo off
echo ========================================
echo SSL Certificate Generator for E-commerce
echo ========================================
echo.

REM Check if keytool exists
where keytool >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: keytool not found!
    echo Please ensure Java JDK is installed and added to PATH
    pause
    exit /b 1
)

echo Generating SSL certificate...
echo.
echo You will be prompted to enter:
echo 1. Keystore password (remember this!)
echo 2. Your details (name, organization, etc.)
echo.

REM Generate the certificate
keytool -genkeypair -alias ecommerce -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore keystore.p12 -validity 365

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Certificate generated successfully!
    echo ========================================
    echo.
    
    REM Move to resources folder
    if exist "keystore.p12" (
        move /Y keystore.p12 src\main\resources\keystore.p12
        echo Certificate moved to: src\main\resources\keystore.p12
        echo.
        echo ========================================
        echo IMPORTANT: Update application.properties
        echo ========================================
        echo Replace 'yourpassword' with the password you just entered
        echo.
        echo File: src\main\resources\application.properties
        echo Line: server.ssl.key-store-password=yourpassword
        echo.
    )
) else (
    echo.
    echo ERROR: Failed to generate certificate
    pause
    exit /b 1
)

echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Update password in application.properties
echo 2. Run: mvnw spring-boot:run
echo 3. Access: https://localhost:8443
echo ========================================
echo.
pause
