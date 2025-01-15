import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // Plugins for Vite
  plugins: [react()],

  // Path aliases for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Use `@` to reference the `src` directory
    },
  },

  // Build configuration
  build: {
    outDir: 'dist', // Output directory for production build
    sourcemap: true, // Generate source maps for easier debugging
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'), // Main entry point for the app
        widget: path.resolve(__dirname, 'src/widget/index.ts'), // Separate entry for the widget
      },
      output: {
        format: 'es', // Use ES module format
        entryFileNames: (chunkInfo) => {
          // Custom entry point naming
          return chunkInfo.name === 'widget'
            ? 'widget.js' // Specific name for the widget
            : 'assets/[name].[hash].js'; // Default naming for other entries
        },
        chunkFileNames: 'assets/[name].[hash].js', // Chunk naming convention
        assetFileNames: 'assets/[name].[hash][extname]', // Asset naming convention
      },
    },
  },

  // Optimize dependencies for faster dev server
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore', // Include common Firebase modules
    ],
  },
});
