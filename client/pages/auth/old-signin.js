import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await axios.post('/api/accounts/signin', { email, password });
      const { token } = response.data;

      // 儲存 JWT 到本地儲存
      localStorage.setItem('token', token);

      // 導向 User Profiles 頁面
      router.push('/profiles');
    } catch (error) {
      setErrorMessage('登入失敗，請檢查帳號和密碼。');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box height="100vh" display="flex" alignItems="center">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" align="center">
              登入
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="密碼"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          {errorMessage && (
            <Grid item xs={12}>
              <Typography color="error">{errorMessage}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={handleSignIn}>
              登入
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SignIn;
