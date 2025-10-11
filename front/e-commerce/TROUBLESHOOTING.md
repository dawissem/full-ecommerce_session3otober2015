# Guide de résolution des erreurs - Angular E-commerce

## Erreurs résolues ✅

### 1. Erreur TypeScript avec User.exp
**Problème**: `Property 'exp' does not exist on type 'User'`

**Solution**: Modifié la méthode `isAuthenticated()` dans `auth.service.ts` pour décoder le JWT directement sans passer par le type User.

```typescript
// Avant (INCORRECT)
const payload = this.decodeToken(token);
if (payload && payload.exp) {
  // ...
}

// Après (CORRECT)
const payloadStr = atob(token.split('.')[1]);
const payload: any = JSON.parse(payloadStr);
if (payload && payload.exp) {
  // ...
}
```

### 2. Erreurs de compilation du composant ForgotPassword
Les propriétés sont correctement définies dans le fichier TypeScript.

## 📋 Étapes pour résoudre les erreurs de compilation

### Option 1: Redémarrage propre
```bash
# 1. Arrêter le serveur Angular (Ctrl+C)

# 2. Supprimer les fichiers de cache
rm -rf node_modules/.cache
rm -rf .angular

# 3. Redémarrer le serveur
ng serve
```

### Option 2: Nettoyage complet (si Option 1 ne fonctionne pas)
```bash
# 1. Arrêter le serveur Angular (Ctrl+C)

# 2. Nettoyer complètement
rm -rf node_modules
rm -rf .angular
rm package-lock.json

# 3. Réinstaller les dépendances
npm install

# 4. Redémarrer
ng serve
```

### Option 3: Build propre
```bash
# Arrêter le serveur et faire un build propre
ng build --configuration development
ng serve
```

## ✅ Vérification post-installation

Une fois le serveur redémarré, vous devriez voir:
```
** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully.
```

## 🧪 Tests à effectuer

### 1. Test d'inscription
1. Allez sur: http://localhost:4200/pages/register
2. Remplissez le formulaire:
   - Username: test_user
   - Full Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - Cochez "I accept terms & conditions"
3. Cliquez sur "Register"
4. Vous devriez être redirigé vers `/pages/login`

### 2. Test de connexion
1. Allez sur: http://localhost:4200/pages/login
2. Entrez vos identifiants:
   - Email: test@example.com
   - Password: password123
3. Cliquez sur "Login"
4. Vous devriez être redirigé vers `/dashboard/dashboard1`

### 3. Test mot de passe oublié
1. Allez sur: http://localhost:4200/pages/forgotpassword
2. Entrez votre email
3. Cliquez sur "Send OTP"
4. Entrez l'OTP reçu par email
5. Entrez un nouveau mot de passe
6. Vous devriez être redirigé vers `/pages/login`

## 🔧 Configuration requise

### Backend Spring Boot
Assurez-vous que votre backend Spring Boot fonctionne sur:
```
http://localhost:8080
```

### Endpoints requis
- POST `/api/v1/auth/signup`
- POST `/api/v1/auth/signin`
- POST `/api/v1/auth/refresh-token`
- POST `/api/v1/auth/forgot-password`
- POST `/api/v1/auth/verify-otp`
- POST `/api/v1/auth/reset-password`

### Configuration CORS
Ajoutez cette configuration dans votre backend:

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.addExposedHeader("Authorization");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

## 📦 Fichiers modifiés

### Nouveaux fichiers créés:
1. `src/app/shared/auth/auth.models.ts` - Modèles TypeScript
2. `src/app/shared/auth/auth.interceptor.ts` - Intercepteur HTTP
3. `src/environments/environment.ts` - Configuration dev
4. `src/environments/environment.prod.ts` - Configuration prod

### Fichiers modifiés:
1. `src/app/shared/auth/auth.service.ts` - Service d'authentification
2. `src/app/pages/content-pages/login/login-page.component.ts` - Login
3. `src/app/pages/content-pages/login/login-page.component.html` - Template Login
4. `src/app/pages/content-pages/register/register-page.component.ts` - Register
5. `src/app/pages/content-pages/register/register-page.component.html` - Template Register
6. `src/app/pages/content-pages/forgot-password/forgot-password-page.component.ts` - Forgot Password
7. `src/app/pages/content-pages/forgot-password/forgot-password-page.component.html` - Template Forgot Password
8. `src/app/app.module.ts` - Module principal (ajout intercepteur)

## 🚀 Commandes utiles

```bash
# Démarrer le frontend
ng serve

# Démarrer le frontend sur un port différent
ng serve --port 4300

# Build de production
ng build --prod

# Vérifier les erreurs TypeScript
ng build --configuration development

# Voir la version Angular
ng version

# Mettre à jour Angular CLI
npm install -g @angular/cli@latest
```

## ❗ Problèmes courants

### Erreur: "Cannot find module '@angular/..."
**Solution**: Réinstaller les dépendances
```bash
npm install
```

### Erreur: Port 4200 déjà utilisé
**Solution**: Utiliser un autre port
```bash
ng serve --port 4300
```

### Erreur CORS
**Solution**: Vérifier la configuration CORS du backend Spring Boot

### Erreur 401 Unauthorized
**Solution**: Vérifier que le token JWT est correctement envoyé dans les headers

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez que le backend Spring Boot fonctionne
2. Vérifiez les logs de la console Angular (F12 → Console)
3. Vérifiez les logs du backend Spring Boot
4. Vérifiez que CORS est correctement configuré

## 🎉 Succès!

Si tout fonctionne correctement, vous devriez pouvoir:
- ✅ S'inscrire avec un nouveau compte
- ✅ Se connecter avec les identifiants
- ✅ Accéder au dashboard protégé
- ✅ Réinitialiser le mot de passe avec OTP
- ✅ Se déconnecter

Le token JWT sera automatiquement ajouté à toutes les requêtes HTTP grâce à l'intercepteur!
