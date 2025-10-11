# 🔐 SSL/HTTPS Setup Instructions

## Quick Start (3 Simple Steps)

### Step 1: Generate SSL Certificate

Run the batch script:
```bash
generate-ssl.bat
```

**What you'll need to enter:**
- **Password**: Choose a strong password (e.g., `MySecurePass123`)
- **What is your first and last name?**: Your Name
- **What is the name of your organizational unit?**: Development
- **What is the name of your organization?**: Your Company
- **What is the name of your City or Locality?**: Your City
- **What is the name of your State or Province?**: Your State
- **What is the two-letter country code?**: TN
- **Is ... correct?**: Type `yes`

### Step 2: Update Password

Open: `src/main/resources/application.properties`

Find this line:
```properties
server.ssl.key-store-password=yourpassword
```

Replace `yourpassword` with the password you chose in Step 1:
```properties
server.ssl.key-store-password=MySecurePass123
```

### Step 3: Run Your Application

```bash
mvnw spring-boot:run
```

**Access your application:**
- Backend API: https://localhost:8443
- Swagger UI: https://localhost:8443/swagger-ui.html
- HTTP (redirects to HTTPS): http://localhost:8080

---

## 📋 What's Been Configured

✅ **SSL/HTTPS Enabled** on port 8443  
✅ **HTTP to HTTPS Redirect** from port 8080  
✅ **CORS** configured for both HTTP and HTTPS  
✅ **Self-signed certificate** for development  
✅ **Certificate files** excluded from Git  

---

## 🌐 Update Your Frontend

If you have an Angular/React frontend, update the API URL:

**Angular (environment.ts):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:8443/api'
};
```

**React (.env):**
```
REACT_APP_API_URL=https://localhost:8443/api
```

---

## ⚠️ Browser Security Warning

When you first access `https://localhost:8443`, you'll see a security warning because the certificate is self-signed.

**To proceed:**
1. Click "Advanced" or "Show details"
2. Click "Proceed to localhost (unsafe)" or "Accept the Risk and Continue"
3. This is **safe for local development**

---

## 🛠️ Manual Certificate Generation

If the script doesn't work, run this command manually:

```bash
keytool -genkeypair -alias ecommerce -keyalg RSA -keysize 2048 -storetype PKCS12 -keystore keystore.p12 -validity 365
```

Then move the file:
```bash
move keystore.p12 src\main\resources\keystore.p12
```

---

## 🔧 Troubleshooting

### Issue: "keytool not found"
**Solution:** Make sure Java JDK is installed and added to PATH

### Issue: Port 8080 or 8443 already in use
**Solution:** Change ports in `application.properties`:
```properties
server.port=9443
# And update redirect port in HttpsRedirectConfig.java
```

### Issue: Certificate expired
**Solution:** Generate a new certificate (valid for 365 days)

### Issue: Frontend CORS errors
**Solution:** Already configured! Check that frontend uses `https://localhost:8443`

---

## 🚀 Production Deployment

For production, you'll need a **trusted certificate** (not self-signed):

### Option 1: Let's Encrypt (Free)
```bash
# Install certbot
choco install certbot

# Generate certificate
certbot certonly --standalone -d yourdomain.com

# Convert to PKCS12
openssl pkcs12 -export -in fullchain.pem -inkey privkey.pem -out keystore.p12
```

### Option 2: Commercial Certificate
1. Purchase from GoDaddy, DigiCert, etc.
2. Download certificate files
3. Convert to PKCS12 format
4. Update `application.properties`

---

## 📁 Project Structure

```
oumaa/
├── src/main/
│   ├── java/com/sesame/ecommerce/
│   │   └── Configuration/
│   │       └── HttpsRedirectConfig.java  ← HTTP→HTTPS redirect
│   └── resources/
│       ├── application.properties        ← SSL configuration
│       └── keystore.p12                 ← SSL certificate (gitignored)
├── generate-ssl.bat                      ← Certificate generator
└── SSL-SETUP.md                          ← This file
```

---

## 🔐 Security Best Practices

✅ **Never commit certificates to Git** (already in `.gitignore`)  
✅ **Use environment variables** for passwords in production  
✅ **Renew certificates** before expiry (365 days for self-signed)  
✅ **Use HTTPS** for all production traffic  
✅ **Keep keystores** in secure locations  

---

## 📞 Need Help?

- Check the main guide artifact for detailed explanations
- Review Spring Security documentation
- Test with Swagger UI: https://localhost:8443/swagger-ui.html

---

**Your application is now secured with SSL/HTTPS! 🎉**
