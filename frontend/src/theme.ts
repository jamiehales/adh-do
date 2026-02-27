import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c3aed',
      light: '#a78bfa',
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#0d0720',
      paper: '#160d2e',
    },
    text: {
      primary: '#f1f0f8',
      secondary: '#8b83b0',
    },
  },
  typography: {
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root': {
          height: '100%',
        },
        body: {
          WebkitFontSmoothing: 'antialiased',
        },
      },
    },
  },
})
