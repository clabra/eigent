import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';

export const AutoLogin = () => {
  const { setAuth, setModelType, setCloudModelType, setIsFirstLaunch, setInitState } = useAuthStore();
  const hasTriedLogin = useRef(false);

  useEffect(() => {
    // Set auth immediately without any delays to avoid routing issues
    if (!hasTriedLogin.current) {
      hasTriedLogin.current = true;

      console.log('🔐 Setting up immediate auto-login with test user...');

      // Use a valid token we know works
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNzYxNjk5MDU5fQ.5jGlIySaVUWqA-kmz7Q5MR6YRDwLAPCDSXF-Dahkt-c';

      console.log('✅ Setting auth state immediately...');
      setAuth({
        email: 'test@example.com',
        username: 'Test User',
        token: validToken,
        user_id: 1
      });
      setModelType('cloud');
      setCloudModelType('gpt-4.1');

      // Skip first launch flow and animations
      setIsFirstLaunch(false);
      setInitState('done');

      // Get OpenAI API key from environment variable
      const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

      // Set the key if it exists and is valid
      if (openaiApiKey && typeof openaiApiKey === 'string' && openaiApiKey.startsWith('sk-')) {
        window.localStorage.setItem('test_openai_key', openaiApiKey);
        console.log('✅ OpenAI API key loaded from environment variable!');
      } else {
        console.log('⚠️ VITE_OPENAI_API_KEY environment variable not set or invalid');
      }

      console.log('✅ Auth state set successfully with test user!');
    }
  }, [setAuth, setModelType, setIsFirstLaunch, setInitState]);

  return null;
};