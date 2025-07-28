# 🔑 API Keys Setup Guide

This guide will help you obtain and configure the required API keys for the Fashion AI Chat Stylist.

## Required API Keys

### 1. Groq API Key (Required)

**Groq** provides lightning-fast LLM inference with LLaMA 3 models.

#### How to get Groq API Key:
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account or log in
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy the generated key
6. Add to your `.env` file: `VITE_GROQ_API_KEY=your_groq_api_key_here`

**Free Tier:** Groq offers generous free tier with high rate limits.

### 2. Qloo API Key (Required)

**Qloo** provides cultural intelligence and personalized recommendations.

#### How to get Qloo API Key:
1. Visit [Qloo](https://qloo.com/)
2. Contact their sales team for API access
3. Request access to their Fashion/Style API
4. Once approved, you'll receive your API key
5. Add to your `.env` file: `VITE_QLOO_API_KEY=your_qloo_api_key_here`

**Note:** Qloo is a B2B service and may require business verification.

### 3. Browser-Use API Key (Required)

**Browser-Use** enables web scraping for real product data from fashion retailers.

#### How to get Browser-Use API Key:
1. Visit [Browser-Use](https://browser-use.com/) or similar web scraping service
2. Sign up for an account
3. Choose a plan that supports e-commerce scraping
4. Generate your API key from the dashboard
5. Add to your `.env` file: `VITE_BROWSER_USE_API_KEY=your_browser_use_api_key_here`

**Alternative:** You can use services like ScrapingBee, Apify, or Bright Data for web scraping.

## Environment Configuration

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file:**
   ```env
   # Fashion AI Chat Stylist API Keys
   VITE_GROQ_API_KEY=gsk_your_actual_groq_key_here
   VITE_QLOO_API_KEY=your_actual_qloo_key_here
   VITE_BROWSER_USE_API_KEY=your_actual_browser_use_key_here
   
   # Optional: Add your API endpoints if using custom backend
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

## Testing Your Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the application** in your browser at `http://localhost:5173`

3. **Test the chat** with a simple message like "Suggest a casual outfit"

4. **Check the browser console** for any API errors

## Troubleshooting

### Common Issues:

1. **Groq API Errors:**
   - Ensure your API key is valid and not expired
   - Check rate limits (Groq has generous free tier)
   - Verify the key starts with `gsk_`

2. **Qloo API Errors:**
   - Confirm your API access is approved
   - Check if your account has the required permissions
   - Verify the API endpoint is correct

3. **Browser-Use API Errors:**
   - Ensure your subscription supports e-commerce scraping
   - Check if the target websites (H&M, Zara) are allowed
   - Verify your rate limits

4. **CORS Issues:**
   - The app uses `dangerouslyAllowBrowser: true` for Groq
   - For production, consider using a backend proxy
   - Some APIs may require server-side implementation

## Development vs Production

### Development:
- API keys are loaded from `.env` file
- CORS is handled with browser flags
- Mock data is used when APIs are unavailable

### Production:
- Use environment variables in your hosting platform
- Consider implementing a backend proxy for sensitive APIs
- Implement proper error handling and fallbacks

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** to prevent abuse
4. **Consider using a backend proxy** for production
5. **Monitor API usage** and set up alerts

## Cost Considerations

- **Groq:** Free tier with generous limits
- **Qloo:** Contact for pricing (B2B service)
- **Browser-Use:** Varies by provider and usage

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all API keys are correctly set
3. Test each API independently
4. Contact the respective API providers for support

---

**Happy styling! 👗✨**
