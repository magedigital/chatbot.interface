import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Читаем package.json для получения значения homepage
const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
const homepage = packageJson.homepage || '/';

// https://vite.dev/config/
export default defineConfig({
  base: homepage,
  plugins: [react()],
})
