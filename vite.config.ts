import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactRouter(),
    tailwindcss(),
    tsconfigPaths()
  ],
  build: {
    minify: 'terser',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorar warning sobre manualChunks
        if (warning.code === 'EXTERNAL_MODULES_CANNOT_BE_INCLUDED_IN_MANUAL_CHUNKS') {
          return
        }
        warn(warning)
      }
    },
    assetsInlineLimit: 4096,
    target: 'esnext',
    ssrEmitAssets: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    force: true
  },
  ssr: {
    noExternal: ['react-router-dom']
  },
  server: {
    host: true,
    allowedHosts: ['1b2ec4466828.ngrok-free.app'],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    cors: true,
    watch: {
      ignored: [
        '**/learned_fixes.json',
        '**/*.md',
        '**/logs/**',
        '**/*.jsonl',
        '**/*.log'
      ]
    },
    port: 5174,
    strictPort: true
  },
  preview: {
    host: true,
    allowedHosts: ['5e9eb966752b.ngrok-free.app'],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    port: 5174,
    strictPort: true
  }
});
