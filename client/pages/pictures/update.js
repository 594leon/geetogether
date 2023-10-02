// pages/upload-avatar.js
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    AppBar,
    Button,
    Paper,
    Stack,
    Box,
    CssBaseline,
    Toolbar,
    Chip,
    Fab,
    IconButton,
    Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function UploadAvatar() {
    const router = useRouter();

    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState([]);

    const handleImageChange = (e) => {
        showErrors();//清空畫面error訊息
        const selectedImage = e.target.files[0];

        if (selectedImage) {
            // 驗證圖片格式
            const allowedFormats = ['image/jpeg', 'image/png'];
            if (allowedFormats.includes(selectedImage.type)) {
                // 驗證圖片大小
                const maxSize = 350 * 1024; // 350KB
                if (selectedImage.size <= maxSize) {
                    setImage(selectedImage);
                    showErrors();
                } else {
                    showErrors('圖片大小必須小於 350KB。');
                    setImage(null);
                }
            } else {
                showErrors('只接受JPEG和PNG格式的圖片。');
                setImage(null);
            }
        }
    };

    const handleImageUpload = async () => {
        showErrors();//清空畫面error訊息
        if (!image) {
            showErrors('請選擇一張圖片。');
            return;
        }

        try {
            const token = localStorage.getItem('gee-token');
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            };

            const formData = new FormData();
            formData.append('image', image);

            const response = await axios.post('/api/pictures/me/avatar', formData, {
                headers,
            });

            if (response.status === 201) {
                console.log('Image uploaded successfully.');
                // 可以執行其他操作，例如顯示上傳成功訊息或重新導向其他頁面
                router.back();

            }
        } catch (error) {
            console.error('Error uploading image:', error);
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
                        修改圖片
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container component="main" maxWidth="xs">
                <Box sx={{ my: 3, mx: 2 }}>
                    {/* <Paper elevation={3} style={{ padding: '20px' }}> */}
                    <Typography variant="h5" gutterBottom>
                        上傳Avatar圖片
                    </Typography>
                    {errors && errors.map((error, index) => <Alert key={index.toString()} severity="error" style={{ marginBottom: '20px' }}>{error.field ? error.message + ', ' + error.field : error.message}</Alert>)}

                    <input type="file" accept="image/jpeg, image/png" onChange={handleImageChange} style={{ marginBottom: '20px' }} />
                    <Button onClick={handleImageUpload} fullWidth variant="contained" color="primary">
                        上傳圖片
                    </Button>
                    {/* </Paper> */}
                </Box>
            </Container>
        </Box>
    );
}
