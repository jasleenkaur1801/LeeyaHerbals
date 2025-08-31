/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        herbal: {
          green: '#1dbf73',
          greenDark: '#0fb573',
          cream: '#f7faf7',
          pink: '#ffd7e5',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(16, 167, 99, 0.15)',
      },
    },
  },
  plugins: [],
}


