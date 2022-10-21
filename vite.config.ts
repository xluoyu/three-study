import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unocss from 'unocss/vite'
import viteEslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unocss(),
    viteEslint()
  ]
})
