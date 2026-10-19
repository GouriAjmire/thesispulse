import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development the React app talks to the Spring Boot API through this proxy,
// so no CORS setup is needed locally.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': process.env.VITE_PROXY_TARGET || 'http://localhost:8080',
    },
  },
});
