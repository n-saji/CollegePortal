import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 8080,  // Optional: Match your deployment port
    host: true,  // Expose to the network
    allowedHosts: ['collegeportal-qcs5o.ondigitalocean.app']
  },
  base: 'https://collegeportal-qcs5o.ondigitalocean.app/',
})
