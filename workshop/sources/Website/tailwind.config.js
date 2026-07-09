/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        desk: {
          bg: '#12211E',      // pinho escuro - mesa de despacho
          panel: '#182C28',
          panel2: '#1E3733',
          line: '#2E4A44',
          paper: '#EDEAE1',
          paper2: '#DAD4C4',
          ink: '#0E1614'
        },
        amber: {
          stamp: '#D98E2B'
        },
        teal: {
          accent: '#3E8F7D'
        },
        alert: {
          critica: '#C1442E',
          alta: '#D98E2B',
          media: '#3E8F7D',
          baixa: '#6D8A84'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Public Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      backgroundImage: {
        'grain': "radial-gradient(rgba(237,234,225,0.04) 1px, transparent 1px)"
      },
      backgroundSize: {
        'grain': '4px 4px'
      }
    },
  },
  plugins: [],
}
