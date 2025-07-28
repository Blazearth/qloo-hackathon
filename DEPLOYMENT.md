# 🚀 Deployment Guide

This guide covers deploying the Fashion AI Chat Stylist to various platforms.

## Pre-deployment Checklist

- [ ] All API keys are configured and tested
- [ ] Application builds successfully (`npm run build`)
- [ ] All features work in production mode (`npm run preview`)
- [ ] Environment variables are documented
- [ ] README is updated with deployment URL

## Platform-Specific Deployment

### 1. Vercel (Recommended)

**Why Vercel?**
- Optimized for React applications
- Automatic deployments from Git
- Built-in environment variable management
- Global CDN and edge functions

**Steps:**
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set Environment Variables:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all required variables:
     - `VITE_GROQ_API_KEY`
     - `VITE_QLOO_API_KEY`
     - `VITE_BROWSER_USE_API_KEY`

5. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 2. Netlify

**Steps:**
1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Or use Netlify Dashboard:**
   - Drag and drop the `dist` folder
   - Or connect your Git repository

4. **Set Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add all required API keys

### 3. GitHub Pages

**Note:** GitHub Pages only supports static sites. API keys will be exposed in the client.

**Steps:**
1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json:**
   ```json
   {
     "homepage": "https://yourusername.github.io/qloo-llm",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### 4. Firebase Hosting

**Steps:**
1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and initialize:**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure firebase.json:**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

## Environment Variables Setup

### For Production Deployment:

1. **Vercel:**
   ```bash
   vercel env add VITE_GROQ_API_KEY
   vercel env add VITE_QLOO_API_KEY
   vercel env add VITE_BROWSER_USE_API_KEY
   ```

2. **Netlify:**
   - Dashboard → Site Settings → Environment Variables
   - Or use Netlify CLI:
   ```bash
   netlify env:set VITE_GROQ_API_KEY your_key_here
   ```

3. **Other Platforms:**
   - Check platform-specific documentation
   - Ensure all variables start with `VITE_` for Vite

## Build Optimization

### 1. Bundle Analysis
```bash
npm run build
npx vite-bundle-analyzer dist
```

### 2. Performance Optimization
- Enable gzip compression
- Implement code splitting
- Optimize images and assets
- Use CDN for static assets

### 3. Production Build Settings
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-slot', 'lucide-react']
        }
      }
    }
  }
})
```

## Security Considerations

### 1. API Key Security
- **Client-side APIs:** Groq allows browser usage with `dangerouslyAllowBrowser: true`
- **Server-side APIs:** Consider implementing a backend proxy for sensitive APIs
- **Rate Limiting:** Implement client-side rate limiting

### 2. CORS Configuration
```typescript
// For production, consider a backend proxy
const proxyConfig = {
  '/api/qloo': 'https://api.qloo.com',
  '/api/browser-use': 'https://api.browser-use.com'
}
```

### 3. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               connect-src 'self' https://api.groq.com https://api.qloo.com;">
```

## Monitoring and Analytics

### 1. Error Tracking
```bash
npm install @sentry/react @sentry/vite-plugin
```

### 2. Performance Monitoring
- Use Vercel Analytics
- Implement custom performance tracking
- Monitor API response times

### 3. User Analytics
```bash
npm install @vercel/analytics
```

## Custom Domain Setup

### 1. Vercel
- Dashboard → Project → Settings → Domains
- Add your custom domain
- Configure DNS records

### 2. Netlify
- Site Settings → Domain Management
- Add custom domain
- Configure DNS or use Netlify DNS

## Troubleshooting Deployment

### Common Issues:

1. **Build Failures:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variable Issues:**
   - Ensure variables start with `VITE_`
   - Check variable names match exactly
   - Verify values are correctly set

3. **API CORS Errors:**
   - Implement backend proxy for production
   - Check API provider CORS settings
   - Use server-side API calls when possible

4. **Performance Issues:**
   - Enable compression
   - Optimize bundle size
   - Use CDN for assets

## Continuous Deployment

### GitHub Actions Example:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Post-Deployment

1. **Test all features** in production
2. **Monitor error rates** and performance
3. **Set up alerts** for API failures
4. **Update documentation** with live URL
5. **Share with users** and gather feedback

---

**Your Fashion AI Chat Stylist is now live! 🎉**
