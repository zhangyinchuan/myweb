import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

// ─── Design Tokens ───────────────────────────────────────────────────────────

const tokens = {
  color: {
    // Primitive
    gray: {
      0:   '#FFFFFF',
      50:  '#F9F9F9',
      100: '#F2F2F2',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0A0A0A',
    },
    blue: {
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
    },
  },
  radius: {
    sm:   4,
    base: 8,
    md:   12,
    lg:   16,
    xl:   24,
  },
  shadow: {
    xs: '0 1px 2px rgba(0,0,0,0.04)',
    sm: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    md: '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
    lg: '0 8px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)',
  },
};

// ─── Base Theme Options ───────────────────────────────────────────────────────

const baseThemeOptions: ThemeOptions = {
  shape: {
    borderRadius: tokens.radius.base, // 8px default
  },
  typography: {
    fontFamily: [
      'var(--font-geist)',
      '-apple-system',
      'BlinkMacSystemFont',
      '"PingFang SC"',
      '"Hiragino Sans GB"',
      'sans-serif',
    ].join(','),
    fontWeightLight:   300,
    fontWeightRegular: 400,
    fontWeightMedium:  500,
    fontWeightBold:    700,
    h1: { fontSize: '3.75rem', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em' },
    h2: { fontSize: '3rem',    fontWeight: 700, lineHeight: 1.2,  letterSpacing: '-0.015em' },
    h3: { fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.875rem',fontWeight: 600, lineHeight: 1.3 },
    h5: { fontSize: '1.5rem',  fontWeight: 600, lineHeight: 1.35 },
    h6: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: '1rem',     lineHeight: 1.625 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', lineHeight: 1.5, letterSpacing: '0.01em' },
    button: { fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.01em', textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': { boxSizing: 'border-box' },
        html: { scrollBehavior: 'smooth', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        img: { maxWidth: '100%', display: 'block' },
        'a': { textDecoration: 'none', color: 'inherit' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.base,
          padding: '10px 20px',
          transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          '&:hover': { transform: 'translateY(-1px)', boxShadow: tokens.shadow.sm },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.md,
          border: 'none',
          boxShadow: 'none',
          transition: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          height: 26,
          fontSize: '0.75rem',
          fontWeight: 500,
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderWidth: 1 } },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid',
        },
      },
    },
    MuiContainer: {
      defaultProps: { maxWidth: 'lg' },
      styleOverrides: {
        maxWidthLg: { maxWidth: '1280px !important' },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          transition: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          textUnderlineOffset: '3px',
        },
      },
    },
  },
}
