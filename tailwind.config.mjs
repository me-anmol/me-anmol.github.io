/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      colors: {
        'darcula-bg':        '#2B2B2B',
        'darcula-panel':     '#3C3F41',
        'darcula-gutter-bg': '#313335',
        'darcula-gutter':    '#606366',
        'darcula-text':      '#A9B7C6',
        'darcula-keyword':   '#CC7832',
        'darcula-string':    '#6A8759',
        'darcula-number':    '#6897BB',
        'darcula-comment':   '#808080',
        'darcula-select':    '#214283',
        'darcula-line':      '#323232',
        'darcula-green':     '#629755',
        'darcula-fn':        '#FFC66D',
        'darcula-cls':       '#A9B7C6',
        'darcula-ann':       '#BBB529',
      },
    },
  },
  plugins: [],
};
