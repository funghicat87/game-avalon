/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        Black: '#070707',
        Gray: '#212121',
        LightGray: '#929292',
        White: '#FFFFFF'
      },
      backgroundImage: {
        Background: 'url("/background.webp")'
      },
      fontFamily: {
        ZenOldMincho: ['Zen Old Mincho', 'serif'],
        Neuton: ['Neuton', 'serif'],
        Roboto: ['Roboto', 'sans-serif'],
        Bokor: ['Bokor', 'system-ui']
      }
    }
  },
  plugins: [require('tailwind-scrollbar')({ preferredStrategy: 'pseudoelements' })]
}
