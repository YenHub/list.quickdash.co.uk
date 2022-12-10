import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import envCompatible from 'vite-plugin-env-compatible'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), envCompatible, viteTsconfigPaths(), svgrPlugin()],
})
