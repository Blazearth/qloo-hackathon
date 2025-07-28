# 👗 Fashion AI Chat Stylist

A production-ready, AI-powered fashion assistant that combines the power of **Groq's LLaMA 3**, **Qloo API**, and **Browser-Use API** to deliver personalized, culturally-informed fashion recommendations with real product suggestions from top retailers.

[![Fashion AI Chat Stylist](https://img.shields.io/badge/AI-Fashion%20Stylist-purple?style=for-the-badge&logo=sparkles)](https://your-deployment-url.com)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Groq](https://img.shields.io/badge/Groq-LLaMA%203-00A67E?style=for-the-badge&logo=groq)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎨 **Visually Stunning UI**: Modern, responsive design with smooth animations and transitions
- 🤖 **AI-Powered Styling**: Natural language fashion consultations using Groq's LLaMA 3
- 🌍 **Cultural Intelligence**: Personalized recommendations based on cultural trends via Qloo API
- 🛍️ **Real Product Integration**: Live product scraping from H&M, Zara, and other major retailers
- 🖼️ **Interactive Product Cards**: Beautiful, interactive product displays with availability and pricing
- ⚡ **Lightning Fast**: Optimized for performance with lazy loading and efficient state management
- 📱 **Fully Responsive**: Perfect experience across all devices and screen sizes
- 🔍 **Smart Product Search**: Advanced search capabilities with filters and sorting options
- 💬 **Context-Aware Chat**: Remembers conversation history for personalized recommendations

## 🛠️ Tech Stack

### Core Technologies
- **Frontend**: React 19 + TypeScript
- **UI Framework**: ShadCN UI + Tailwind CSS
- **State Management**: React Hooks + Context API
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS 3.4 + CSS Modules

### AI & APIs
- **LLM**: Groq (LLaMA 3-8B-8192)
- **Cultural Intelligence**: Qloo API
- **Product Search**: Browser-Use API
- **HTTP Client**: Axios

### Development Tools
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript 5.8
- **Version Control**: Git
- **Package Manager**: npm / yarn

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm (v9+) or yarn (v1.22+)
- API keys for:
  - [Groq API](https://console.groq.com/)
  - [Qloo API](https://www.qloo.com/)
  - [Browser-Use API](https://browser-use.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fashion-ai-stylist.git
   cd fashion-ai-stylist
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # OR using yarn
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example .env file
   cp .env.example .env
   ```
   
   Update the `.env` file with your API keys:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_QLOO_API_KEY=your_qloo_api_key
   VITE_BROWSER_USE_API_KEY=your_browser_use_api_key
   ```

4. **Start the development server**
   ```bash
   # Development mode
   npm run dev
   
   # Production build
   npm run build
   npm run preview
   ```
   
   The application will be available at `http://localhost:5173`

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   VITE_QLOO_API_KEY=your_qloo_api_key_here
   VITE_BROWSER_USE_API_KEY=your_browser_use_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 API Keys Setup

### Groq API
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up/login and create a new API key
3. Copy the key to `VITE_GROQ_API_KEY`

### Qloo API
1. Contact Qloo for API access
2. Get your API key and add to `VITE_QLOO_API_KEY`

### Browser-Use API
1. Visit [Browser-Use](https://browser-use.com/)
2. Sign up and get your API key
3. Add to `VITE_BROWSER_USE_API_KEY`

## 💬 Usage Examples

Try these conversation starters:

- "Suggest me a trendy outfit for summer brunch"
- "What's trending in streetwear right now?"
- "I need professional attire for a job interview"
- "Show me casual date night looks under ₹5000"
- "What should I wear to a wedding in Mumbai?"

## 🏗️ Project Structure

```
src/
├── components/
│   └── Chat.tsx              # Main chat interface
├── lib/
│   ├── groq.ts              # Groq API integration
│   ├── qloo.ts              # Qloo API wrapper
│   └── browserUse.ts        # Browser-Use API client
├── components/ui/           # ShadCN UI components
├── App.tsx                  # Main app component
├── App.css                  # Custom styles
└── main.tsx                 # App entry point
```

## 🔧 Configuration

### Groq Model Settings
The app uses `llama3-8b-8192` model with:
- Temperature: 0.7 (balanced creativity)
- Max tokens: 1000
- Tool calling enabled

### Available Tools
1. **getQlooSuggestion**: Cultural fashion recommendations
2. **searchHnM**: Real H&M product search

## 🎨 Customization

### Adding New Retailers
To add support for new fashion retailers:

1. Update `browserUse.ts` with new search functions
2. Add new tools to the Groq configuration
3. Update the tool handling logic

### Styling
Customize the appearance by editing:
- `App.css` for global styles
- Tailwind classes in components
- ShadCN theme configuration

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in your hosting platform

## 🐛 Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure all API keys are correctly set in `.env`
   - Check API key validity and permissions

2. **CORS Issues**
   - Groq API allows browser requests with `dangerouslyAllowBrowser: true`
   - For production, consider using a backend proxy

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run build`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for lightning-fast LLM inference
- [Qloo](https://qloo.com/) for cultural intelligence
- [ShadCN](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Made with ❤️ for the fashion-forward community**
