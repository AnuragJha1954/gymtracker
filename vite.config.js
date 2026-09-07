import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' });

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-middleware',
      configureServer(server) {
        server.middlewares.use('/api/data', async (req, res, next) => {
          try {
            // Very naive body parser
            let body = '';
            req.on('data', chunk => { body += chunk.toString() });
            req.on('end', async () => {
              try {
                req.body = body ? JSON.parse(body) : {};
              } catch(e) { req.body = {}; }
              
              const handler = await import('./api/data.js');
              
              // Mock res.status().json()
              const originalRes = res;
              let statusCode = 200;
              const mockRes = {
                status: (code) => { statusCode = code; return mockRes; },
                json: (data) => {
                  originalRes.statusCode = statusCode;
                  originalRes.setHeader('Content-Type', 'application/json');
                  originalRes.end(JSON.stringify(data));
                }
              };

              await handler.default(req, mockRes);
            });
          } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        });
      }
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Gym Tracker Pro',
        short_name: 'GymTracker',
        description: 'Isolated Gym Tracking App',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'pwa-512x512.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
