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
    proxy: {
      '/api': 'https://c7d0f354-10b0-4c36-a2dc-e1807319a93a.cloud.ce.kmitl.ac.th'
    }
  }
})
