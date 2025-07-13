// vite.config.js
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ['smart-lms.loca.lt'] // ✅ your custom LocalTunnel subdomain
  }
})
