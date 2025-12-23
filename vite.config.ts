import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import cesium from 'vite-plugin-cesium'
import path from 'node:path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    cesium(),
    electron([
      {
        // 主进程入口文件
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
      },
      {
        // 预加载脚本
        entry: 'electron/preload.ts',
        onstart(options) {
          // 通知渲染进程重新加载
          options.reload()
        },
        vite: {
          build: {
            outDir: 'dist-electron',
            // 预加载脚本必须使用 CommonJS 格式
            lib: {
              entry: 'electron/preload.ts',
              formats: ['cjs'],
              fileName: () => 'preload.js',
            },
            rollupOptions: {
              external: ['electron'],
              output: {
                entryFileNames: 'preload.js',
              },
            },
          },
        },
      },
    ]),
    renderer(),
    {
      ...nodeResolve({
        preferBuiltins: true,
      }),
    },
    {
      ...commonjs(),
    },
    {
      name: 'fix-cesium-path',
      transformIndexHtml(html) {
        return html
          .replace(/href="\/cesium\//g, 'href="./cesium/')
          .replace(/src="\/cesium\//g, 'src="./cesium/')
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['events'],
  },
  // 开发服务器配置
  server: {
    port: 5173,
  },
  // 生产构建配置
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
