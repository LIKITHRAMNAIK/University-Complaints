import { useState } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
} from '@mui/material';
import Login from './Login';
import Register from './Register';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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