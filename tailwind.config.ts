import type { Config } from 'tailwindcss';
const { heroui } = require('@heroui/react');

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: '#FFFFFF',
            foreground: '#11181C',
            primary: {
              50: '#eefbf2',
              100: '#d7f4df',
              200: '#b2e8c4',
              300: '#7fd6a2',
              400: '#4dbe7e',
              500: '#27a260',
              600: '#19824c',
              700: '#14683f',
              800: '#125334',
              900: '#10442c',
              950: '#082619',
              DEFAULT: '#0EA5E9',
              foreground: '#FFFFFF',
            },
            focus: '#0EA5E9',
            card: '#F8F9FA',
            secondaryLight: '#93C5FD',
            secondaryDark: '#1D4ED8',
          },
        },
        dark: {
          colors: {
            background: '#060917',
            foreground: '#FFFFFF',
            primary: {
              50: '#eefbf2',
              100: '#d7f4df',
              200: '#b2e8c4',
              300: '#7fd6a2',
              400: '#4dbe7e',
              500: '#27a260',
              600: '#19824c',
              700: '#14683f',
              800: '#125334',
              900: '#10442c',
              950: '#082619',
              DEFAULT: '#27a260',
              foreground: '#FFFFFF',
            },
            focus: '#F182F6',
            card: '#1D202A',
            secondaryLight: '#93C5FD',
            secondaryDark: '#1D4ED8',
          },
        },
      },
      layout: {
        disabledOpacity: '0.3',
        radius: {
          small: '4px',
          medium: '6px',
          large: '8px',
        },
        borderWidth: {
          small: '1px',
          medium: '2px',
          large: '3px',
        },
      },
    }),
    require('tailwindcss-animate'),
  ],
};

export default config;
