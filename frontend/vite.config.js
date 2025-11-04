import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    strictPort: true,
    proxy: {
      '^/api/.*': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
        secure: false,
        ws: true,
        xfwd: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
            if (res.writeHead && !res.headersSent) {
              res.writeHead(500, {'Content-Type': 'application/json'});
              res.end(JSON.stringify({error: 'Proxy error occurred'}));
            }
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('X-Forwarded-Proto', 'http');
            console.log(`Proxying ${req.method} ${req.url} to ${options.target}`);
          });
        }
      },
      '^/ai(/|$)': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
        secure: false,
        ws: true,
        xfwd: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
            if (res.writeHead && !res.headersSent) {
              res.writeHead(500, {'Content-Type': 'application/json'});
              res.end(JSON.stringify({error: 'Proxy error occurred'}));
            }
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('X-Forwarded-Proto', 'http');
            console.log(`Proxying ${req.method} ${req.url} to ${options.target}`);
          });
        }
      },
    },
  },
})
