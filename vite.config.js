import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000, // You can change the port if needed
  },
  envPrefix: 'VITE_', // Ensures only variables prefixed with VITE_ are exposed
});
