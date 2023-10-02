// pages/register-login.js

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
    Button,
    TextField,
    Grid,
    Container,
    Paper,
    Typography,
    Alert,
    Box,
    Avatar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function RegisterLogin() {
    const router = useRouter();
    const [errors, setErrors] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();//e.preventDefault() 是一個常見的 JavaScript 事件處理函式，它用於阻止事件的默認行為。在您的情境中，它通常用於阻止提交表單或點擊連結時的默認行為。
        //具體來說，當您在表單的提交按鈕上調用 e.preventDefault() 時，它會阻止表單的預設提交行為，也就是防止瀏覽器刷新頁面並向後端發送 POST 請求。這對於使用 JavaScript 配合 AJAX 或 Fetch 來處理表單提交非常有用，因為您可以在不刷新頁面的情況下處理表單數據並進行自定義操作，然後根據 API 響應進行適當的處理。
        //同樣，當您在一個連結或按鈕的點擊事件處理函式中調用 e.preventDefault()，它會阻止該連結的默認行為，例如跳轉到新的頁面。這樣您可以使用 JavaScript 來定義自己的行為，例如使用路由導航，而不需要瀏覽器執行該連結的預設操作。

        showErrors();//清空畫面error訊息
        try {
            const response = await axios.post('/api/auth/signup', formData);

            if (response.status === 201) {
                const { accountId, token } = response.data;

                // 儲存 JWT 到本地儲存
                localStorage.setItem('gee-accountId', accountId);
                localStorage.setItem('gee-token', token);

                // 導向 User Profiles 頁面
                router.push('/profiles/add');
            }
        } catch (error) {
            console.error('Error registering:', error);
            showErrors(error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        showErrors();//清空畫面error訊息
        try {
            const response = await axios.post('/api/auth/signin', formData);

            if (response.status === 201) {
                const { accountId, token } = response.data;

                // 儲存 JWT 到本地儲存
                localStorage.setItem('gee-accountId', accountId);
                localStorage.setItem('gee-token', token);

                //令牌有效，導向主要頁面
                router.push('/main/main-timeline');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            showErrors(error);
        }
    };

    const showErrors = (error) => {
        if (!error) {
            setErrors([]);

        } else if (error.response && error.response.data && error.response.data.errors && Array.isArray(error.response.data.errors)) {
            setErrors(error.response.data.errors);

        } else if (error.response && error.response.data) {
            setErrors([{ message: error.response.data.toString() }]);

        } else {
            setErrors([{ message: error }]);
        }
    };

    return (
        <Box >
            {/* <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h5" gutterBottom>
                    註冊 / 登入
                </Typography>
                {errors && errors.map((error, index) => <Alert key={index.toString()} severity="error" style={{ marginBottom: '20px' }}>{error.field ? error.message + ', ' + error.field : error.message}</Alert>)}

                <form>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="Email"
                                name="email"
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="密碼"
                                name="password"
                                type="password"
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                    </Grid>
                    <Button onClick={handleRegister} fullWidth variant="contained" color="primary" style={{ marginTop: '10px' }}>
                        註冊
                    </Button>
                    <Button onClick={handleLogin} fullWidth variant="outlined" color="primary" style={{ marginTop: '10px' }}>
                        登入
                    </Button>
                </form>
            </Paper> */}

            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    {errors && errors.map((error, index) => <Alert key={index.toString()} severity="error" style={{ marginBottom: '20px' }}>{error.field ? error.message + ', ' + error.field : error.message}</Alert>)}

                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                        />
                        {/* <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        /> */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleLogin}
                        >
                            登入
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleRegister}
                        >
                            註冊
                        </Button>

                        {/* <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid> */}
                    </Box>
                </Box>
                {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
            </Container>
        </Box>


    );
}
