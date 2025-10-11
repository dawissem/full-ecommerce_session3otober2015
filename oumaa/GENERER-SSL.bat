@echo off
echo ========================================
echo Generation du Certificat SSL
echo ========================================
echo.

REM Verification de keytool
where keytool >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: keytool introuvable!
    echo Assurez-vous que Java JDK est installe
    pause
    exit /b 1
)

echo Generation du certificat SSL...
echo.
echo Informations requises:
echo - Mot de passe: changeit
echo - Nom: Votre nom
echo - Organisation: E-commerce
echo - Ville: Tunis
echo - Pays: TN
echo.

REM Generer le certificat avec les parametres pre-remplis
keytool -genkeypair -alias ecommerce -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore keystore.p12 -validity 365 -dname "CN=localhost, OU=Development, O=E-commerce, L=Tunis, ST=Tunis, C=TN" -storepass changeit -keypass changeit

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCES! Certificat genere
    echo ========================================
    echo.
    
    if exist "keystore.p12" (
        echo Deplacement vers src\main\resources...
        move /Y keystore.p12 src\main\resources\keystore.p12
        if %errorlevel% equ 0 (
            echo.
            echo ========================================
            echo TOUT EST PRET!
            echo ========================================
            echo Certificat: src\main\resources\keystore.p12
            echo Mot de passe: changeit
            echo.
            echo Redemarrez votre application Spring Boot
            echo Acces: https://localhost:8443
            echo ========================================
        ) else (
            echo ERREUR: Impossible de deplacer le fichier
            echo Deplacez manuellement keystore.p12 vers src\main\resources\
        )
    )
) else (
    echo.
    echo ERREUR: Echec de la generation
    pause
    exit /b 1
)

echo.
pause
