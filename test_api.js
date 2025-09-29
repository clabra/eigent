// Test script for programmatically launching a "sum 2+2" prompt
import axios from 'axios';

async function testSumPrompt() {
  const apiUrl = 'http://127.0.0.1:5678/chat';

  const payload = {
    task_id: 'test_sum_task_' + Date.now(),
    question: 'sum 2+2',
    email: 'test@example.com',
    model_platform: 'openai',
    model_type: 'gpt-4',
    api_key: 'your_openai_api_key_here', // Replace with actual API key
    language: 'en',
    max_retries: 3,
    allow_local_system: false
  };

  try {
    console.log('🚀 Sending request to:', apiUrl);
    console.log('📝 Payload:', JSON.stringify(payload, null, 2));

    const response = await axios.post(apiUrl, payload, {
      timeout: 5000 // 5 second timeout for demo
    });

    console.log('✅ Success! Response received');
    console.log('📊 Status:', response.status);
    console.log('📄 Response data:', response.data);

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.log('⏱️  Request timed out (expected for demo)');
    } else if (error.response) {
      console.log('❌ API Error:', error.response.status);
      console.log('📄 Error data:', error.response.data);
    } else {
      console.log('🔌 Connection Error:', error.message);
    }
  }
}

// Run the test
testSumPrompt();