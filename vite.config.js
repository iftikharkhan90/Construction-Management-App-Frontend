import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

function copyRedirectsPlugin() {
  return {
    name: 'copy-redirects',
    closeBundle() {
      copyFileSync('_redirects', resolve(__dirname, 'dist/_redirects'))
    }
  }
}

export default defineConfig({
  plugins: [react(), copyRedirectsPlugin()],
})
