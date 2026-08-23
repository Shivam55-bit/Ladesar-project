import { createTheme } from '@mui/material/styles';

// You can customize colors to match Ladesar Organics branding
const theme = createTheme({
  palette: {
    mode: 'light', // Can be toggled dynamically later
    primary: {
      main: '#2E7D32', // A rich green, fitting for an "Organics" brand
      light: '#60ad5e',
      dark: '#005005',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f57c00', // An earthy orange/amber
      light: '#ffad42',
      dark: '#bb4d00',
      contrastText: '#fff',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none', // Modern look, non-capitalized buttons
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default theme;
