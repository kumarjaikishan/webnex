/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#06060B",
        panel: "#101018",
        panel2: "#15151F",
        edge: "#232333",
        mist: "#9797AC",
        violet: "#7C6CFB",
        cyan: "#3FD6E0",
        paper: "#F3F2FA",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "aurora": "radial-gradient(60% 60% at 20% 20%, rgba(124,108,251,0.25) 0%, rgba(6,6,11,0) 60%), radial-gradient(50% 50% at 85% 15%, rgba(63,214,224,0.18) 0%, rgba(6,6,11,0) 60%)",
        "grad-primary": "linear-gradient(90deg, #7C6CFB 0%, #3FD6E0 100%)",
      },
    },
  },
  plugins: [],
};
