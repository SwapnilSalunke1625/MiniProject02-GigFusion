/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "stdYellow": "#FF3D00",
        "PrimaryColor1": "#FF3D00",
        "stdBlue": "#223265",
        "stdBg": "#ECDDD6",
        "inpBg": "#C7C8CC",
        "reviewdiv": "#FAD5B3",
        "color1": "#FF3D00",
        "color2": "#FFDACF",
        "color3": "#FDD017",
        "btnColor": "#223265",
        "profilebtn": "#4400FF",
        "Completedchat": "#000836",
        "bgCompleted": "#EDE8DC",
        "Pendingbg": "#D9D9D9",
        "trackBar": "#399918",
        "hoverEffect": "#FFB69F",
        "footercolr": "#000836",
        "newRequest": "#FFEFEF",
        "redflag": "#F95454",
        "greenFlag": "#399918",
        "GoogleIcon": "#4285F4"

      },
      fontFamily: {
        stdFont: ['poppins', 'sans-serif'],
      },
      fontSize: {
        "homeTag": "40px",
        "headTag": "32px",
        "primaryFont": "18px",
        "secondaryFont": "16px",
        "ternaryFont": "22px",
        "paraFont": "14px",
        "paraHead": "36px"



      },
      height: {
        "inpBtnH": "35px",
        "inpH": "40px",
        "LargeBtn": "45px"
      },
      width: {
        "inpBtnW": "200px",
        "inpW": "330px"

      },
      padding: {
        "padsize": "15px"

      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 1.5s linear infinite',
        blink: 'blink 1s step-end infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .5 },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      }
    },
  },
  plugins: [],
};