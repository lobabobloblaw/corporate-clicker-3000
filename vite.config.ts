import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

/**
 * Vite configuration for Discord Activity
 */
export default defineConfig({
  plugins: [
    react()
  ],

  // Path aliases matching tsconfig.json
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@app': resolve(__dirname, './src/app'),
      '@api': resolve(__dirname, './src/api'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@components': resolve(__dirname, './src/components'),
      '@types': resolve(__dirname, './src/types')
    }
  },

  // Server configuration for local development
  server: {
    // Discord requires HTTPS in production
    // Use Cloudflare Tunnel for local HTTPS testing
    port: 5173,
    strictPort: true,
    // Enable CORS for Discord iframe
    cors: true,
    // Hot Module Replacement
    hmr: {
      overlay: true
    }
  },

  // Build optimization for production
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Target modern browsers (Discord clients are up-to-date)
    target: 'es2020',
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'discord-sdk': ['@discord/embedded-app-sdk']
        }
      }
    },
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: true
      }
    }
  },

  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', '@discord/embedded-app-sdk']
  }
})
