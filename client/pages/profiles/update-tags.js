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
    CssBaseline,
    Snackbar,
    Alert,
    Box,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { useRouter } from 'next/router';

const UpdateTags = () => {
    const router = useRouter();
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        // 取得localStorage中的'gee-profile-tags'並設定為name的初始值
        const profileTags = localStorage.getItem('gee-profile-tags');
        console.log('profileTags: ' + profileTags);
        if (profileTags) {
            setTags(profileTags);
        }
    }, []);

    const handleChange = (event) => {
        setTags(event.target.value);
    };

    const handleUpdateTags = async () => {
        try {
            setLoading(true);
            showErrors(); // 清除之前可能的錯誤訊息
            const myTags = tags.split(',');
            const token = localStorage.getItem('gee-token');
            const response = await axios.put('/api/profiles/me/tags', { myTags }, { headers: { Authorization: `Bearer ${token}` } });
            if (response.status === 201) {
                // 更新成功，可以根據後端API的回應進行相應處理
                router.back();
            }
        } catch (error) {
            // 處理錯誤，顯示錯誤訊息
            showErrors(error);
            console.error('Tags更新失敗', error);
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
                        修改關於我
                    </Typography>
                    {errors && errors.map((error, index) => <Alert key={index.toString()} severity="error" style={{ marginBottom: '20px' }}>{error.field ? error.message + ', ' + error.field : error.message}</Alert>)}

                    <TextField
                        variant="outlined"
                        fullWidth
                        label="標籤 (逗號分隔)"
                        name="myTags"
                        onChange={handleChange}
                        value={tags}
                        required
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateTags}
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

export default UpdateTags;
