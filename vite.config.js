import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/vfort/api': {
        target: 'http://localhost:8070',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
          });
        }
      },
      '/flow-api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
          });
        },
        rewrite: (path) => path.replace(/^\/flow-api/, '')
      }
    }
  },
  build: {
    outDir: 'build', // This keeps the final folder named 'build' just like CRA did
  },
});