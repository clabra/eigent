import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Web-only Vite config without Electron
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      },
    },
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: env.VITE_USE_LOCAL_PROXY === 'true' && env.VITE_PROXY_URL ? {
        '/api': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
        }
      } : undefined
    },
    clearScreen: false,
  }
})