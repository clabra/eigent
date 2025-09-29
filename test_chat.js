// Test script to check chat functionality
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNzYxNjk5MDU5fQ.5jGlIySaVUWqA-kmz7Q5MR6YRDwLAPCDSXF-Dahkt-c';

async function testChatAPI() {
    console.log('Testing chat API...');

    // First, let's try to create a chat history entry
    try {
        const historyResponse = await fetch('http://localhost:3001/api/chat/history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "task_id": "test_task_123",
                "user_id": 1,
                "question": "sum 2+2",
                "language": "en_US",
                "model_platform": "openai",
                "model_type": "gpt-4.1",
                "api_url": "cloud",
                "max_retries": 3,
                "file_save_path": "string",
                "installed_mcp": "string",
                "status": 1,
                "tokens": 0
            })
        });

        const historyData = await historyResponse.text();
        console.log('History response:', historyData);

        // Try to create a chat step
        const stepResponse = await fetch('http://localhost:3001/api/chat/steps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "task_id": "test_task_123",
                "step": "user_question",
                "data": { "content": "sum 2+2" }
            })
        });

        const stepData = await stepResponse.text();
        console.log('Step response:', stepData);

    } catch (error) {
        console.error('Error testing chat API:', error);
    }
}

testChatAPI();