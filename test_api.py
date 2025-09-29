#!/usr/bin/env python3
"""Test script for programmatically launching a 'sum 2+2' prompt"""

import requests
import json
import time

def test_sum_prompt():
    """Test the chat API with a simple math prompt"""
    api_url = 'http://127.0.0.1:5678/chat'

    payload = {
        'task_id': f'test_sum_task_{int(time.time() * 1000)}',
        'question': 'sum 2+2',
        'email': 'test@example.com',
        'model_platform': 'openai',
        'model_type': 'gpt-4',
        'api_key': 'your_openai_api_key_here',  # Replace with actual API key
        'language': 'en',
        'max_retries': 3,
        'allow_local_system': False
    }

    try:
        print('🚀 Sending request to:', api_url)
        print('📝 Payload:', json.dumps(payload, indent=2))

        response = requests.post(api_url, json=payload, timeout=5)

        print('✅ Success! Response received')
        print('📊 Status:', response.status_code)
        print('📄 Response data:', response.text[:500] + '...' if len(response.text) > 500 else response.text)

    except requests.exceptions.Timeout:
        print('⏱️  Request timed out (expected for demo)')
    except requests.exceptions.RequestException as e:
        print('🔌 Connection Error:', str(e))
    except Exception as e:
        print('❌ Unexpected Error:', str(e))

if __name__ == '__main__':
    test_sum_prompt()