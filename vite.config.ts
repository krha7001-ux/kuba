import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base מותאם ל־GitHub Pages: האתר מוגש תחת https://<user>.github.io/kuba/
export default defineConfig({
  plugins: [react()],
  base: '/kuba/',
});
