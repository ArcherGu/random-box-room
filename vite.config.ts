import { join } from 'node:path'
import { defineConfig } from 'vite'
import React from '@vitejs/plugin-react'
import UnoCss from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/random-box-room/',
  plugins: [
    React(),
    UnoCss(),
    AutoImport({
      resolvers: [
        IconsResolver({
          prefix: 'Icon',
          extension: 'jsx',
        }),
      ],
    }),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
    }),
  ],
  resolve: {
    alias: {
      '@src': join(__dirname, './src'),
    },
  },
})
