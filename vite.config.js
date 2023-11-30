import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		react(),
		istanbul({
			include: 'src/*',
			exclude: ['node_modules', 'cypress'],
			extension: ['.js', '.jsx'],
		}),
	],
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 5000, // you can replace this port with any port
  }
})
