import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173, // Or whatever port your frontend runs on
    proxy: {
      '/api': 'http://localhost:5000', // <-- THIS IS THE VITE PROXY CONFIG
    }
  }
})
