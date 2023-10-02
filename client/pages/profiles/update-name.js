import React, { useState, useEffect } from 'react';
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    Container,
    TextField,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    Box,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useRouter } from 'next/router';

const UpdateName = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        // 取得localStorage中的'gee-profile-name'並設定為name的初始值
        const profileName = localStorage.getItem('gee-profile-name');
        if (profileName) {
            setName(profileName);
        }
    }, []);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleUpdateName = async () => {
        try {
            setLoading(true);
            showErrors(); // 清除之前可能的錯誤訊息
            const token = localStorage.getItem('gee-token');
            const response = await axios.put('/api/profiles/me/name', { name }, { headers: { Authorization: `Bearer ${token}` } });
            if (response.status === 201) {
                // 更新成功，可以根據後端API的回應進行相應處理
                router.back();
            }
        } catch (error) {
            // 處理錯誤，顯示錯誤訊息
            showErrors(error);
            console.error('名稱更新失敗', error);
        } finally {
            setLoading(false);
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
        <Box>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    borderRadius: '0px 0px 16px 16px', // 設置弧度框線
                }}
            >
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => router.back()}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" noWrap>
                        修改
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm">
                <Box sx={{ my: 3, mx: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        修改名稱
                    </Typography>
                    {errors && errors.map((error, index) => <Alert key={index.toString()} severity="error" style={{ marginBottom: '20px' }}>{error.field ? error.message + ', ' + error.field : error.message}</Alert>)}

                    <TextField
                        label="名稱"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={handleNameChange}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateName}
                        disabled={loading}
                        style={{ marginTop: '20px' }}
                    >
                        {loading ? <CircularProgress size={24} /> : '儲存'}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default UpdateName;
