import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5174,
    proxy: {
      '/uapi': {
        target: 'http://124.156.186.82:8888', // 业务后端
        changeOrigin: true,
      },
      '/api': {
        target: 'http://124.156.186.82:8888', // AI 网关
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 核心库分离
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI 库分离
          'vendor-ui': ['antd', '@ant-design/icons', 'lucide-react'],
          // 第三方大库分离
          'vendor-heavy': ['reactflow', 'framer-motion', 'zustand', 'axios'],
        },
      },
    },
    // 调整 chunk 大小警告阈值
    chunkSizeWarningLimit: 800,
  },
})
