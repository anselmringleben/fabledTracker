import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

// Get current git hash
const commitHash = execSync('git rev-parse --short HEAD').toString().trim()
const buildDate = new Date().toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/fabledTracker/',
  define: {
    __GIT_REV__: JSON.stringify(commitHash),
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
