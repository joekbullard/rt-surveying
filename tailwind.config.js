/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.html"],
  theme: {
    fontFamily: {
      'sans': ['ui-sans-serif', 'system-ui'],
      'serif': ['Poppins', 'sans-serif'],
      'mono': ['ui-monospace', 'SFMono-Regular'],   
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '20px',
      '12': '12px',
    },
    extend: {
      spacing: {
        '128': '400px',
      },
    },
  },
  plugins: [],
}
