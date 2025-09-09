import { useState } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Button,
  Divider,
} from '@mui/material';
import Login from './Login';
import Register from './Register';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleGoogleLogin = () => {
    console.log('Google Login Clicked');
    // TODO: Integrate Google OAuth later
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={4}>
        <Typography variant="h3" align="center" gutterBottom color="primary">
          🎓 University Complaints Portal
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
          Welcome! Please login or register to continue
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            backgroundColor: 'primary.main',
            '& .MuiTab-root': {
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.1rem',
            },
            '& .Mui-selected': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Box p={3}>
          {/* Google Login Button */}
          <Box mb={3} textAlign="center">
            <Button
              variant="outlined"
              size="large"
              onClick={handleGoogleLogin}
              sx={{
                borderColor: '#4285f4',
                color: '#4285f4',
                '&:hover': {
                  borderColor: '#3367d6',
                  backgroundColor: 'rgba(66, 133, 244, 0.04)',
                },
              }}
            >
              <Box component="span" mr={1}>
                🔍
              </Box>
              Continue with Google
            </Button>
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Tab Content */}
          {activeTab === 0 && (
            <Box>
              <Login />
            </Box>
          )}
          {activeTab === 1 && (
            <Box>
              <Register />
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default HomePage;
