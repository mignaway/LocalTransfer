import { defineConfig } from 'vite'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'

const enableCORS = () => (req, res, next) => {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Continue to the next middleware or route
  next();
};

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    middleware: [
      enableCORS(),
    ]
  },
  build: {
    outDir: './electron/react'
  },
})
