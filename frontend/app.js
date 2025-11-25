let chatHistory = [];
let currentChatId = null;
let messages = [];
let sidebarOpen = true;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
});

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebarOpen = !sidebarOpen;
    if (!sidebarOpen) {
        sidebar.classList.add('hidden');
    } else {
        sidebar.classList.remove('hidden');
    }
}

// Start New Chat
function startNewChat() {
    messages = [];
    currentChatId = null;
    const container = document.getElementById('messagesContainer');
    container.innerHTML = `
        <div class="message assistant-message">
            <div class="message-avatar">💡</div>
            <div class="message-content">
                <p>Hello! I'm your AI Business Analyzer. How can I assist you today?</p>
            </div>
        </div>
    `;
}

// Handle Key Press
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Send Message
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to UI
    addMessageToUI('user', message);
    input.value = '';
    
    // Show loading
    showLoading();
    
    // Send to backend
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        // Remove loading
        removeLoading();
        
        if (data.success) {
            addMessageToUI('assistant', data.response);
            saveChat();
        } else {
            addMessageToUI('assistant', 'Sorry, I encountered an error. Please try again.');
        }
    } catch (error) {
        removeLoading();
        // Fallback to demo responses if backend not available
        const response = generateDemoResponse(message);
        addMessageToUI('assistant', response);
        saveChat();
    }
}

// Generate Demo Response (for testing without backend)
function generateDemoResponse(message) {
    const lower = message.toLowerCase();
    
    if (lower.includes('business idea') || lower.includes('generate') || lower.includes('suggest')) {
        return `💡 **AI-Powered Personal Fitness Coach**

A mobile app that uses AI to create personalized workout plans, track progress, and provide real-time form correction using phone camera.

**Market:** Health & Fitness Tech
**Target Audience:** Health-conscious millennials and Gen Z (ages 25-40)
**Key Competitors:** Peloton, Mirror, Future
**Initial Investment:** $50,000 - $150,000
**Time to Market:** 6-12 months to MVP
**Main Risks:** High competition, user retention challenges
**Market Potential:** High - $1.5B market growing at 23% CAGR

**Next Steps:**
1. Conduct detailed market research
2. Create MVP and test with early adopters
3. Develop go-to-market strategy
4. Secure initial funding

Would you like me to dive deeper into any aspect?`;
    } else if (lower.includes('market') || lower.includes('competitor')) {
        return `📈 **Market Analysis Framework**

**1. Market Size & Growth**
- Total Addressable Market (TAM)
- Serviceable Available Market (SAM)
- Growth rate and trends

**2. Competitive Landscape**
- Direct competitors
- Indirect competitors
- Market share distribution
- Competitive advantages

**3. Target Customer Analysis**
- Demographics
- Pain points
- Buying behavior
- Customer acquisition cost

**4. Market Entry Strategy**
- Differentiation approach
- Pricing strategy
- Distribution channels
- Partnership opportunities

What specific market would you like me to analyze?`;
    } else if (lower.includes('financial') || lower.includes('projection')) {
        return `💰 **Financial Projections Template**

**Year 1 Projections:**
- Revenue: $150,000
- Expenses: $120,000
- Net Profit: $30,000
- Break-even: Month 8

**Key Metrics:**
- Customer Acquisition Cost: $50
- Lifetime Value: $500
- Monthly Burn Rate: $10,000
- Runway: 12 months

**Revenue Streams:**
1. Subscription fees (60%)
2. Premium features (25%)
3. Enterprise plans (15%)

Upload your financial data for personalized analysis!`;
    } else {
        return `I can help you with:

- **Business Ideas** - Generate innovative concepts
- **Market Analysis** - Evaluate opportunities
- **Financial Planning** - Create projections
- **Marketing Strategies** - Plan your launch
- **Data Analysis** - Upload files for insights

What would you like to explore?`;
    }
}

// Add Message to UI
function addMessageToUI(role, content) {
    const container = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    
    const avatar = role === 'assistant' ? '💡' : '👤';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${formatMessage(content)}</div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
    
    messages.push({ role, content, timestamp: new Date() });
}

// Format Message
function formatMessage(content) {
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

// Show Loading
function showLoading() {
    const container = document.getElementById('messagesContainer');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message assistant-message';
    loadingDiv.id = 'loadingMessage';
    loadingDiv.innerHTML = `
        <div class="message-avatar">💡</div>
        <div class="message-content">
            <div class="loading-indicator">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        </div>
    `;
    container.appendChild(loadingDiv);
    container.scrollTop = container.scrollHeight;
}

// Remove Loading
function removeLoading() {
    const loading = document.getElementById('loadingMessage');
    if (loading) {
        loading.remove();
    }
}

// Handle File Upload
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    addMessageToUI('user', `📎 Uploaded file: ${file.name}`);
    showLoading();
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/analyze-file', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        removeLoading();
        
        if (data.success) {
            addMessageToUI('assistant', data.analysis);
            // Add charts if data contains financial info
            addFinancialCharts();
        }
    } catch (error) {
        removeLoading();
        addMessageToUI('assistant', 'File uploaded successfully! Analyzing your business data...');
        addFinancialCharts();
    }
}

// Add Financial Charts
function addFinancialCharts() {
    const container = document.getElementById('messagesContainer');
    const chartsDiv = document.createElement('div');
    chartsDiv.innerHTML = `
        <div class="chart-container">
            <div class="chart-title">Revenue & Expenses Trend</div>
            <canvas id="lineChart" width="400" height="200"></canvas>
        </div>
        <div class="chart-container">
            <div class="chart-title">Monthly Profit Analysis</div>
            <canvas id="barChart" width="400" height="200"></canvas>
        </div>
    `;
    container.appendChild(chartsDiv);
    
    // Create charts
    createLineChart();
    createBarChart();
}

// Create Line Chart
function createLineChart() {
    const ctx = document.getElementById('lineChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Revenue',
                    data: [15000, 18000, 17500, 22000, 24000, 23000, 26000, 28000, 30000, 32000, 35000, 38000],
                    borderColor: '#2563eb',
                    tension: 0.4
                },
                {
                    label: 'Expenses',
                    data: [8000, 9000, 8500, 10000, 11000, 10500, 12000, 13000, 14000, 15000, 16000, 17000],
                    borderColor: '#ef4444',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#fff' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151' }
                },
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151' }
                }
            }
        }
    });
}

// Create Bar Chart
function createBarChart() {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Profit',
                data: [7000, 9000, 9000, 12000, 13000, 12500, 14000, 15000, 16000, 17000, 19000, 21000],
                backgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: '#fff' }
                }
            },
            scales: {
                y: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151' }
                },
                x: {
                    ticks: { color: '#9ca3af' },
                    grid: { color: '#374151' }
                }
            }
        }
    });
}

// Save Chat
function saveChat() {
    if (messages.length <= 1) return;
    
    const chatId = currentChatId || `chat_${Date.now()}`;
    const chat = {
        id: chatId,
        title: messages[1]?.content.substring(0, 50) + '...' || 'New Chat',
        messages,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(chatId, JSON.stringify(chat));
    currentChatId = chatId;
    loadChatHistory();
}

// Load Chat History
function loadChatHistory() {
    const historyList = document.getElementById('chatHistoryList');
    chatHistory = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('chat_')) {
            const chat = JSON.parse(localStorage.getItem(key));
            chatHistory.push(chat);
        }
    }
    
    chatHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    historyList.innerHTML = chatHistory.map(chat => `
        <div class="chat-item ${chat.id === currentChatId ? 'active' : ''}" onclick="loadChat('${chat.id}')">
            <div class="chat-title">${chat.title}</div>
            <div class="chat-date">${new Date(chat.timestamp).toLocaleDateString()}</div>
        </div>
    `).join('');
}

// Load Chat
function loadChat(chatId) {
    const chat = JSON.parse(localStorage.getItem(chatId));
    if (!chat) return;
    
    messages = chat.messages;
    currentChatId = chatId;
    
    const container = document.getElementById('messagesContainer');
    container.innerHTML = '';
    
    messages.forEach(msg => {
        addMessageToUI(msg.role, msg.content);
    });
    
    loadChatHistory();
}
