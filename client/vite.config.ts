import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 5173,

    allowedHosts: [
      "overstrict-nonpartial-glynda.ngrok-free.dev"
    ],

    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false
      }
    }
  },

  // Production Build Optimization
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion'],
          'three-vendor': ['three'],
          'query-vendor': ['@tanstack/react-query']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable source maps in production for smaller bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    // Enable compression
    reportCompressedSize: true,
  },

  // Optimize deps
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: []
  }
})
