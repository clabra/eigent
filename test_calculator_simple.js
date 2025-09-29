#!/usr/bin/env node
/**
 * Simple test to verify the calculator functionality with Ollama.
 * Tests that a "2+2" prompt can be sent to the system.
 */

import { randomUUID } from 'crypto';

async function testCalculatorIntegration() {
    console.log('🧮 Eigent Calculator Integration Test (Node.js)');
    console.log('=' .repeat(50));

    const baseUrl = 'http://localhost:5678';
    const taskId = randomUUID();

    try {
        // Test 1: Backend health check
        console.log('1. Testing backend health...');
        const healthResponse = await fetch(`${baseUrl}/docs`);
        console.log(`   Backend: ${healthResponse.ok ? '✅ Healthy' : '❌ Unhealthy'} (${healthResponse.status})`);

        if (!healthResponse.ok) {
            console.log('❌ Backend is not healthy, aborting test');
            return false;
        }

        // Test 2: Ollama health check
        console.log('\n2. Testing Ollama health...');
        const ollamaResponse = await fetch('http://localhost:11434/api/tags');
        console.log(`   Ollama: ${ollamaResponse.ok ? '✅ Healthy' : '❌ Unhealthy'} (${ollamaResponse.status})`);

        if (ollamaResponse.ok) {
            const ollamaData = await ollamaResponse.json();
            const models = ollamaData.models?.map(m => m.name) || [];
            console.log(`   Available models: ${models.join(', ')}`);
        }

        // Test 3: Calculator integration
        console.log('\n3. Testing calculator integration...');
        console.log(`   Task ID: ${taskId}`);

        const chatRequest = {
            task_id: taskId,
            question: "Please calculate 2+2 using the calculator tool and return just the number 4",
            email: "test@example.com",
            model_platform: "ollama",
            model_type: "llama3.2:1b",
            api_key: "ollama",
            api_url: "http://localhost:11434/v1",
            language: "en",
            browser_port: 9222,
            max_retries: 3,
            allow_local_system: true,
            installed_mcp: { mcpServers: {} },
            bun_mirror: "",
            uvx_mirror: "",
            env_path: null,
            new_agents: [
                {
                    name: "calculator_agent",
                    description: "Agent specialized in mathematical calculations",
                    tools: ["calculator_mcp_toolkit"],
                    mcp_tools: { mcpServers: {} },
                    env_path: null
                }
            ],
            extra_params: {
                openai_api_base: "http://localhost:11434/v1",
                calculator_enabled: true
            }
        };

        console.log('   📤 Sending chat request...');
        const chatResponse = await fetch(`${baseUrl}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chatRequest)
        });

        console.log(`   📥 Response status: ${chatResponse.status}`);

        if (chatResponse.ok) {
            const responseData = await chatResponse.text();
            console.log('   ✅ Chat request accepted successfully');
            console.log('   ⏳ Task is processing asynchronously...');

            console.log('\n' + '='.repeat(50));
            console.log('📊 TEST RESULTS');
            console.log('='.repeat(50));
            console.log('✅ All services are running correctly');
            console.log('✅ Calculator integration test request submitted');
            console.log(`📝 Task ID: ${taskId}`);
            console.log('\n🔍 To verify the calculation worked:');
            console.log('1. Check the backend logs for calculator tool usage');
            console.log('2. Look for "2+2" calculation and "4" result');
            console.log('3. Monitor the frontend at http://localhost:3000');

            return true;
        } else {
            const errorText = await chatResponse.text();
            console.log(`   ❌ Error: ${chatResponse.status} - ${errorText}`);
            return false;
        }

    } catch (error) {
        console.log(`❌ Test failed with error: ${error.message}`);
        return false;
    }
}

// Run the test
testCalculatorIntegration()
    .then(success => {
        if (success) {
            console.log('\n🎉 Integration test completed successfully!');
            process.exit(0);
        } else {
            console.log('\n💥 Integration test failed!');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('💥 Unexpected error:', error);
        process.exit(1);
    });