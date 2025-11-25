# 🚀 AI Business Idea & Market Analyzer

A powerful GenAI-powered web application that helps entrepreneurs, students, and professionals generate unique business ideas and evaluate their market potential. Built with Python backend and modern web technologies.

## ✨ Features

- 💡 **AI-Powered Business Idea Generation** - Generate creative and unique business concepts based on your preferences
- 📊 **Market Analysis** - Get comprehensive market insights including target audience, competitors, and potential risks
- 💰 **Financial Projections** - Receive basic financial forecasts and revenue models
- 📈 **Data Visualization** - Upload CSV/TXT files to analyze business data with interactive charts
- 🎯 **Marketing Strategies** - Get tailored marketing recommendations and go-to-market strategies
- 💬 **ChatGPT-Style Interface** - Intuitive chat-based interaction with conversation history
- 📁 **File Upload** - Analyze your monthly income data and business metrics
- 🕒 **Chat History** - Save and revisit your previous conversations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🎯 Use Cases

- **Startup Brainstorming** – Quickly generate and refine innovative ideas for tech, retail, or service-based businesses
- **Market Opportunity Scouting** – Identify gaps in the market for new product or service launches
- **Investor Pitch Preparation** – Create concise, data-backed business pitches for funding meetings
- **Side Hustle Exploration** – Find viable small-scale or part-time business opportunities with low starting capital
- **Business Performance Analysis** – Upload financial data to get insights and improvement recommendations

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python, Flask
- **AI**: Anthropic Claude API
- **Charts**: Chart.js
- **Deployment**: Vercel
- **Storage**: LocalStorage (chat history)

## 📋 Prerequisites

- Python 3.9 or higher
- Node.js and npm (for Vercel CLI)
- Anthropic API key ([Get one here](https://console.anthropic.com))

## 🚀 Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhousxrenz/business-analyzer-ai.git
   cd business-analyzer-ai
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   export ANTHROPIC_API_KEY=your_api_key_here
   ```
   
   Or create a `.env` file:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. **Run the application**
   ```bash
   python api/chat.py
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5000`
   - Or open `frontend/index.html` directly for demo mode

### Demo Mode (No Backend Required)

You can test the frontend without setting up the backend:

1. Open `frontend/index.html` in your browser
2. The app will work with pre-programmed demo responses
3. All features work except real-time AI generation

## 🌐 Deploy to Vercel

### Method 1: Deploy Button (Easiest)

Click the "Deploy with Vercel" button at the top of this README and follow the prompts.

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel Dashboard**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `ANTHROPIC_API_KEY` = `your_api_key`

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Method 3: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add `ANTHROPIC_API_KEY` environment variable
6. Click "Deploy"

## 📁 Project Structure

```
business-analyzer-ai/
├── api/
│   └── chat.py              # Flask backend API
├── frontend/
│   ├── index.html           # Main HTML file
│   ├── styles.css           # Styling
│   └── app.js               # Frontend JavaScript
├── requirements.txt         # Python dependencies
├── vercel.json             # Vercel configuration
├── .gitignore              # Git ignore file
└── README.md               # This file
```

## 🎨 Features Walkthrough

### 1. Generate Business Ideas
Simply ask: "Generate a business idea" or "Suggest a startup idea"
- Receive detailed business concepts
- Get market size estimates
- See competitor analysis
- View investment requirements

### 2. Market Analysis
Ask: "Analyze the market for [your idea]"
- Target audience identification
- Competitive landscape overview
- Market entry strategies
- Growth projections

### 3. Financial Planning
Ask: "Create financial projections"
- Revenue forecasts
- Cost structure breakdown
- Break-even analysis
- Key financial metrics

### 4. Upload Business Data
- Click "Upload File" button in sidebar
- Upload CSV or TXT files with your business metrics
- Get automated analysis with visual charts
- See revenue, expense, and profit trends

### 5. Chat History
- All conversations are automatically saved
- Access previous chats from the sidebar
- Continue where you left off
- Start new chats anytime

## 📊 Sample Queries

Try asking:
- "Generate a tech startup idea"
- "What are the best markets for e-commerce in 2024?"
- "Create financial projections for a SaaS business"
- "Analyze competitors in the fitness app space"
- "Give me marketing strategies for a B2B product"
- "What are the risks of starting an AI business?"

## 🔧 Configuration

### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/chat.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/chat.py"
    }
  ]
}
```

### Python Dependencies (`requirements.txt`)

```txt
flask==3.0.0
flask-cors==4.0.0
anthropic==0.18.1
python-dotenv==1.0.0
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Chart.js may not load immediately on slow connections
- LocalStorage has a 5-10MB limit depending on browser
- File uploads limited to text-based formats (CSV, TXT, JSON)


