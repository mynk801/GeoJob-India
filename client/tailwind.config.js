/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode manually if needed, but we'll default to dark theme classes
  theme: {
    extend: {
      colors: {
        background: '#0B0F19', // Deep gray/blue background
        surface: '#1A1F2C',    // Slightly lighter surface for cards
        surfaceHover: '#252B3B', // Hover state for surfaces
        primary: '#3B82F6',    // Bright blue
        accent: '#10B981',     // Neon emerald green for tags/highlights
        textPrimary: '#F8FAFC', // Near white
        textSecondary: '#94A3B8', // Slate gray for secondary text
        border: '#334155',     // Sleek border color
      }
    },
  },
  plugins: [],
}
