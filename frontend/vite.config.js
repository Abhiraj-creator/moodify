import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output directly into backend/public so Express can serve it
    outDir: path.resolve(__dirname, '../backend/public'),
  },
})

