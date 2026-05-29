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
      'Inter',
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
          border: `1px solid`,
          transition: 'box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
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
};

// ─── Light Theme ─────────────────────────────────────────────────────────────

export const lightTheme = responsiveFontSizes(
  createTheme({
    ...baseThemeOptions,
    palette: {
      mode: 'light',
      primary: {
        main:         tokens.color.blue[600],
        light:        tokens.color.blue[500],
        dark:         tokens.color.blue[700],
        contrastText: tokens.color.gray[0],
      },
      secondary: {
        main:         tokens.color.gray[700],
        light:        tokens.color.gray[500],
        dark:         tokens.color.gray[900],
        contrastText: tokens.color.gray[0],
      },
      text: {
        primary:   tokens.color.gray[900],
        secondary: tokens.color.gray[500],
        disabled:  tokens.color.gray[400],
      },
      background: {
        default: tokens.color.gray[0],
        paper:   tokens.color.gray[50],
      },
      divider: tokens.color.gray[200],
    },
    components: {
      ...baseThemeOptions.components,
      MuiCard: {
        ...baseThemeOptions.components?.MuiCard,
        styleOverrides: {
          root: {
            ...(baseThemeOptions.components?.MuiCard?.styleOverrides as any)?.root,
            borderColor: tokens.color.gray[200],
            backgroundColor: tokens.color.gray[50],
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: tokens.shadow.md,
            },
          },
        },
      },
      MuiAppBar: {
        ...baseThemeOptions.components?.MuiAppBar,
        styleOverrides: {
          root: {
            ...(baseThemeOptions.components?.MuiAppBar?.styleOverrides as any)?.root,
            backgroundColor: 'rgba(255,255,255,0.85)',
            borderBottomColor: tokens.color.gray[100],
            color: tokens.color.gray[900],
          },
        },
      },
    },
  })
);

// ─── Dark Theme ───────────────────────────────────────────────────────────────

export const darkTheme = responsiveFontSizes(
  createTheme({
    ...baseThemeOptions,
    palette: {
      mode: 'dark',
      primary: {
        main:         tokens.color.blue[400],
        light:        tokens.color.blue[500],
        dark:         tokens.color.blue[600],
        contrastText: tokens.color.gray[950],
      },
      secondary: {
        main:         tokens.color.gray[400],
        light:        tokens.color.gray[300],
        dark:         tokens.color.gray[600],
        contrastText: tokens.color.gray[950],
      },
      text: {
        primary:   tokens.color.gray[50],
        secondary: tokens.color.gray[400],
        disabled:  tokens.color.gray[600],
      },
      background: {
        default: tokens.color.gray[950],
        paper:   tokens.color.gray[900],
      },
      divider: tokens.color.gray[800],
    },
    components: {
      ...baseThemeOptions.components,
      MuiCard: {
        ...baseThemeOptions.components?.MuiCard,
        styleOverrides: {
          root: {
            ...(baseThemeOptions.components?.MuiCard?.styleOverrides as any)?.root,
            borderColor: tokens.color.gray[800],
            backgroundColor: tokens.color.gray[900],
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.40), 0 2px 6px rgba(0,0,0,0.25)',
            },
          },
        },
      },
      MuiAppBar: {
        ...baseThemeOptions.components?.MuiAppBar,
        styleOverrides: {
          root: {
            ...(baseThemeOptions.components?.MuiAppBar?.styleOverrides as any)?.root,
            backgroundColor: 'rgba(10,10,10,0.85)',
            borderBottomColor: tokens.color.gray[900],
            color: tokens.color.gray[50],
          },
        },
      },
    },
  })
);

export { tokens };
export type AppTheme = typeof lightTheme;
