/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Professional Color Palette
        primary: {
          dark: '#2B2F36',      // Dark slate/charcoal for primary backgrounds
          DEFAULT: '#4A90E2',   // Crisp blue accent
          light: '#67A5F0',     // Lighter blue variant
        },
        secondary: {
          DEFAULT: '#F7F8FA',   // Very light gray background
          dark: '#E5E7EB',      // Slightly darker gray
        },
        accent: {
          blue: '#4A90E2',      // Crisp blue
          coral: '#FF6B61',     // Coral accent
          purple: '#9B59B6',    // Soft purple for minor touches
        },
        text: {
          dark: '#333333',      // Dark text
          light: '#FFFFFF',     // Light text
          muted: '#6B7280',     // Muted text
        },
        background: {
          light: '#F7F8FA',
          dark: '#2B2F36',
        }
      },
      boxShadow: {
        'professional': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'professional-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'professional-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
