import { createTheme } from "@mui/material"

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff2ec4',
      contrastText: '#0f0f0f',
    },
    secondary: {
      main: '#00f0ff',
      contrastText: '#0f0f0f',
    },
    background: {
      default: '#0a0a0a',
      paper: '#141414',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    error: {
      main: '#ff1744',
    },
    warning: {
      main: '#ff9100',
    },
    info: {
      main: '#00b0ff',
    },
    success: {
      main: '#69f0ae',
    },
  },
  typography: {
    fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      textTransform: 'uppercase',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.25rem',
      letterSpacing: '2px',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '10px 24px',
          fontWeight: 700,
          backgroundImage: 'linear-gradient(45deg, #ff2ec4 30%, #00f0ff 90%)',
          color: '#0f0f0f',
          boxShadow: '0 0 8px #ff2ec4',
          '&:hover': {
            boxShadow: '0 0 12px #00f0ff',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #141414, #1e1e1e)',
          border: '1px solid #333',
          boxShadow: '0 0 12px rgba(255, 46, 196, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#141414',
          borderRadius: 6,
        },
      },
    },
  }
})