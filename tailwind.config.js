/**
 * Rebuild assets/css/tailwind.css after adding or changing utility classes:
 *
 *   npx -y tailwindcss@3.4.17 -i assets/css/tailwind.input.css -o assets/css/tailwind.css --minify
 */
module.exports = {
  content: ['./index.html', './assets/js/*.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#070a0f',
          surface: '#0e141e',
          'surface-hover': '#151e2c',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#38bdf8',
          amber: '#f59e0b',
          emerald: '#10b981',
          text: '#f1f5f9',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    }
  }
};
