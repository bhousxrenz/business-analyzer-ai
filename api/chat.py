from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from anthropic import Anthropic

app = Flask(__name__)
CORS(app)

# Initialize Anthropic client
client = Anthropic(api_key=os.environ.get("AIzaSyCtdhcJMqWtfYdYAinx-mQ5oHILFdqdEd8"))

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        # Call Claude API
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[
                {
                    "role": "user",
                    "content": f"""You are an AI Business Analyzer. Help with:
                    - Generating business ideas
                    - Market analysis
                    - Financial projections
                    - Marketing strategies
                    
                    User query: {message}"""
                }
            ]
        )
        
        return jsonify({
            'success': True,
            'response': response.content[0].text
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analyze-file', methods=['POST'])
def analyze_file():
    try:
        file = request.files.get('file')
        if not file:
            return jsonify({'success': False, 'error': 'No file provided'}), 400
        
        content = file.read().decode('utf-8')
        
        # Analyze with Claude
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            messages=[
                {
                    "role": "user",
                    "content": f"""Analyze this business data and provide insights:
                    
                    {content}
                    
                    Provide:
                    - Key metrics
                    - Growth trends
                    - Recommendations"""
                }
            ]
        )
        
        return jsonify({
            'success': True,
            'analysis': response.content[0].text
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
