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

// Send Message with Real AI
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to UI
    addMessageToUI('user', message);
    input.value = '';
    
    // Show loading
    showLoading();
    
    // Build conversation context
    const conversationHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
    }));
    
    try {
        // Call Claude API directly from frontend
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'YOUR_ANTHROPIC_API_KEY', // Replace with your actual key or use environment variable
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 2000,
                messages: [
                    ...conversationHistory,
                    {
                        role: 'user',
                        content: `You are an AI Business Analyzer assistant. Help with:
- Generating creative business ideas with detailed analysis
- Providing market analysis and competitor insights
- Creating financial projections and strategies
- Developing marketing and growth strategies
- Analyzing business data and trends

User query: ${message}

Provide detailed, actionable insights. Be creative and specific in your responses.`
                    }
                ]
            })
        });
        
        const data = await response.json();
        
        // Remove loading
        removeLoading();
        
        if (data.content && data.content[0]) {
            const aiResponse = data.content[0].text;
            addMessageToUI('assistant', aiResponse);
            saveChat();
        } else {
            addMessageToUI('assistant', 'Sorry, I encountered an error. Please try again.');
        }
    } catch (error) {
        console.error('API Error:', error);
        removeLoading();
        addMessageToUI('assistant', 'Unable to connect to AI service. Please check your API key and try again.');
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

// Handle File Upload with AI Analysis
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    addMessageToUI('user', `📎 Uploaded file: ${file.name}`);
    showLoading();
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        const fileContent = e.target.result;
        
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'AIzaSyCtdhcJMqWtfYdYAinx-mQ5oHILFdqdEd8', // Replace with your actual key
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 2000,
                    messages: [{
                        role: 'user',
                        content: `Analyze this business data file and provide comprehensive insights:

Filename: ${file.name}
Content:
${fileContent}

Provide:
1. Key metrics and trends
2. Revenue/expense analysis
3. Growth patterns
4. Recommendations for improvement
5. Potential risks and opportunities

Be specific and actionable.`
                    }]
                })
            });
            
            const data = await response.json();
            removeLoading();
            
            if (data.content && data.content[0]) {
                addMessageToUI('assistant', data.content[0].text);
                
                // Add charts if numeric data detected
                if (/\d+/.test(fileContent)) {
                    addFinancialCharts();
                }
                
                saveChat();
            }
        } catch (error) {
            console.error('File analysis error:', error);
            removeLoading();
            addMessageToUI('assistant', 'Error analyzing file. Please check your API connection.');
        }
    };
    
    reader.readAsText(file);
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
    
    // Create charts with sample data
    setTimeout(() => {
        createLineChart();
        createBarChart();
    }, 100);
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
