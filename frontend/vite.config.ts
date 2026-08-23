import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/orders': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/zones': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/agents': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/tracking': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/rate-cards': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});

