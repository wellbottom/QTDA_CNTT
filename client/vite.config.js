import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//import tailwind css
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(), //also needed to mention inside plugins array
  ],
})
