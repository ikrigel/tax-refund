# Vercel Deployment Guide - מערכת חילוץ טופס 106

## ⚠️ Vercel 404: NOT_FOUND Fix

אם אתה מקבל שגיאת 404 בהתחלה לאחר הפריסה, בעקוב את ההנחיות הבאות:

### שלב 1: בדוק את Project Settings

1. עבור ל-[vercel.com](https://vercel.com)
2. בחר את project שלך
3. עבור ל-**Settings** tab
4. בחר **General**
5. וודא שהגדרות אלה נכונות:

```
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Framework Preset: Vite
```

### שלב 2: בדוק את Config Files

וודא שהקבצים הבאים נמצאים ב-`frontend/` תיקיה:

**frontend/vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

**frontend/package.json** (בדוק שקיימת תמונה זו):
```json
{
  "scripts": {
    "build": "vite build",
    ...
  }
}
```

**frontend/vite.config.js**:
```javascript
export default defineConfig({
  ...
  build: {
    outDir: 'dist',
    ...
  },
});
```

### שלב 3: Redeploy

```bash
# בתיקיית project
cd frontend

# Force redeploy
vercel --prod --force
```

### שלב 4: View Build Logs

אם עדיין יש בעיה:

1. עבור ל-Vercel Dashboard
2. בחר את הפרויקט
3. לחץ על **Deployments**
4. בחר את ה-deployment האחרון
5. לחץ על **View Logs**
6. תעתיק את ההודעות על שגיאה

## GitHub Integration Setup

### Automatically Deploy on Push

1. עבור ל-[vercel.com/new](https://vercel.com/new)
2. בחר **Import Git Repository**
3. בחר את ה-GitHub/GitLab/Bitbucket repository
4. הגדר את הפרויקט:
   - **Project Name**: tax-refund
   - **Root Directory**: `frontend` (בחר מה-dropdown)
   - **Framework Preset**: Vite
5. הוסף Environment Variables:
   ```
   REACT_APP_WEBHOOK_URL=https://your-n8n-domain.com/webhook/tax-refund
   ```
6. לחץ **Deploy**

### Automatic Deployments

כעת, כל `git push` ל-main/production יגרום לפריסה אוטומטית:

```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel תפריס בעצמה
```

## Environment Variables

### בפיתוח:

צור `frontend/.env.local`:
```
REACT_APP_WEBHOOK_URL=http://localhost:5678/webhook/tax-refund
```

### בייצור (Vercel):

1. עבור לפרויקט ב-Vercel
2. **Settings** → **Environment Variables**
3. הוסף משתנים חדשים:

| Variable | Value |
|----------|-------|
| `REACT_APP_WEBHOOK_URL` | `https://your-n8n-domain.com/webhook/tax-refund` |

4. בחר את ה-environments (Production, Preview, Development)
5. לחץ **Save**

## Testing Your Deployment

### 1. בדוק את התנהלות העמוד

```bash
curl -I https://your-vercel-domain.com/
# צריך להחזיר 200 OK
```

### 2. בדוק את ה-API

```bash
# בדוק אם webhook accessible
curl -I https://your-n8n-domain.com/webhook/tax-refund
# צריך להחזיר 405 Method Not Allowed (כי GET לא מתומך) - זה בסדר
```

### 3. בדוק בדפדפן

1. פתח את `https://your-vercel-domain.com/`
2. בדוק את ה-console (F12) בשגיאות
3. נסה להעלות קובץ וודא שזה עובד

## Common Issues & Solutions

### Issue: "Cannot find module 'react'"

**סיבה**: Dependencies לא התקנו

**פתרון**:
```bash
# מחק את node_modules
rm -rf node_modules package-lock.json

# התקן מחדש
npm install

# דחוף ל-repo
git add package-lock.json
git commit -m "chore: update package-lock"
git push
```

### Issue: "Module not found" for local imports

**סיבה**: Paths לא מחופשים כמו שצריך

**פתרון**:
- ודא שכל imports משתמשים ב-`./` או `../` paths
- בדוק שאין typos בשמות קבצים

### Issue: "Build fails with vite not found"

**סיבה**: @vitejs/plugin-react לא התקנו

**פתרון**:
```bash
cd frontend
npm install @vitejs/plugin-react vite
npm run build
```

### Issue: "Styles not loading"

**סיבה**: CORS או content-type issues

**פתרון**:
- וודא styles.css נמצא ב-`frontend/src/`
- וודא ש-index.html קורא את ה-CSS כמו שצריך

## Performance Optimization

### 1. Image Optimization

אם יש לך תמונות, הוסף:
```bash
npm install next/image
```

### 2. Bundle Analysis

```bash
npm install -g vite-plugin-visualizer
```

### 3. Enable Compression

Vercel עושה זאת באופן אוטומטי

## Monitoring

### View Deployment Status

```bash
# בדוק status
vercel status

# בדוק logs
vercel logs https://your-domain.com
```

### Analytics

עבור ל-Vercel Dashboard → Analytics tab לראות metrics

## Security

### Environment Variables Security

- ❌ לא שומר secrets ב-code או .env files
- ✅ השתמש ב-Vercel Environment Variables
- ✅ סיום API keys ב-GitHub Secrets

### CORS Security

בדוק שה-n8n webhook מאפשר CORS:

```bash
curl -H "Origin: https://your-vercel-domain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://your-n8n-domain.com/webhook/tax-refund
```

## Rollback

אם פריסה שוברת, חזור לגרסה קודמת:

1. עבור ל-Vercel Dashboard
2. **Deployments**
3. בחר deployment קודם ש-worked
4. לחץ ⋯ (More)
5. בחר **Promote to Production**

## Advanced: Custom Domain

1. Vercel Dashboard → Project Settings
2. Domains → Add Domain
3. עדכן את DNS records (Vercel יתן הנחיות)
4. פתור סמנך תעודה (Let's Encrypt - אוטומטי)

## Troubleshooting Checklist

- [ ] Root Directory set to `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Framework: Vite
- [ ] vercel.json exists in frontend folder
- [ ] package.json has "build" script
- [ ] vite.config.js has `outDir: 'dist'`
- [ ] index.html in frontend root
- [ ] Environment variables set in Vercel
- [ ] npm install successful
- [ ] No build errors in logs
- [ ] Webhook URL correct in env var
- [ ] n8n webhook accessible from internet

## Getting Help

אם עדיין יש בעיות:

1. בדוק את Vercel Build Logs
2. בדוק את Browser Console (F12)
3. בדוק את `DEPLOYMENT.md` לעוד טיפים
4. בדוק את `claude.md` לפרטי architecture

---

**צעד הבא**: אם הפריסה עובדת, בדוק את החיבור ל-n8n webhook בסעיף "בדיקת חיבור" ב-DEPLOYMENT.md
