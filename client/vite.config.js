import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import envCompatible from 'vite-plugin-env-compatible'
import { VitePWA } from 'vite-plugin-pwa'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: './build',
  },
  plugins: [
    react(),
    envCompatible,
    viteTsconfigPaths(),
    svgrPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      manifestFilename: 'site.webmanifest',
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
