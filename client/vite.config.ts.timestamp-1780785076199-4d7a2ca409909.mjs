// vite.config.ts
import { TanStackRouterVite } from "file:///C:/Hotea%20Emanuel/React/advanced-patterns-react/node_modules/.pnpm/@tanstack+router-plugin@1.8_935077ba884e87186b5c9e54942f75d1/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
import react from "file:///C:/Hotea%20Emanuel/React/advanced-patterns-react/node_modules/.pnpm/@vitejs+plugin-react@4.3.3_vite@5.4.11_@types+node@22.9.3_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { defineConfig } from "file:///C:/Hotea%20Emanuel/React/advanced-patterns-react/node_modules/.pnpm/vite@5.4.11_@types+node@22.9.3/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "C:\\Hotea Emanuel\\React\\advanced-patterns-react\\client";
var ReactCompilerConfig = {};
var vite_config_default = defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]]
      }
    }),
    TanStackRouterVite()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxIb3RlYSBFbWFudWVsXFxcXFJlYWN0XFxcXGFkdmFuY2VkLXBhdHRlcm5zLXJlYWN0XFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcSG90ZWEgRW1hbnVlbFxcXFxSZWFjdFxcXFxhZHZhbmNlZC1wYXR0ZXJucy1yZWFjdFxcXFxjbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0hvdGVhJTIwRW1hbnVlbC9SZWFjdC9hZHZhbmNlZC1wYXR0ZXJucy1yZWFjdC9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBUYW5TdGFja1JvdXRlclZpdGUgfSBmcm9tIFwiQHRhbnN0YWNrL3JvdXRlci1wbHVnaW4vdml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5cbmNvbnN0IFJlYWN0Q29tcGlsZXJDb25maWcgPSB7fTtcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3Qoe1xuICAgICAgYmFiZWw6IHtcbiAgICAgICAgcGx1Z2luczogW1tcImJhYmVsLXBsdWdpbi1yZWFjdC1jb21waWxlclwiLCBSZWFjdENvbXBpbGVyQ29uZmlnXV0sXG4gICAgICB9LFxuICAgIH0pLFxuICAgIFRhblN0YWNrUm91dGVyVml0ZSgpLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlYsU0FBUywwQkFBMEI7QUFDaFksT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLG9CQUFvQjtBQUg3QixJQUFNLG1DQUFtQztBQUt6QyxJQUFNLHNCQUFzQixDQUFDO0FBRzdCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLE9BQU87QUFBQSxRQUNMLFNBQVMsQ0FBQyxDQUFDLCtCQUErQixtQkFBbUIsQ0FBQztBQUFBLE1BQ2hFO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxtQkFBbUI7QUFBQSxFQUNyQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
