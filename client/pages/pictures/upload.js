// pages/upload-avatar.js
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Paper, Typography, Alert, Box } from '@mui/material';

export default function UploadAvatar() {
    const router = useRouter();

    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];

        if (selectedImage) {
            // 驗證圖片格式
            const allowedFormats = ['image/jpeg', 'image/png'];
            if (allowedFormats.includes(selectedImage.type)) {
                // 驗證圖片大小
                const maxSize = 350 * 1024; // 350KB
                if (selectedImage.size <= maxSize) {
                    setImage(selectedImage);
                    setError('');
                } else {
                    setError('圖片大小必須小於 350KB。');
                    setImage(null);
                }
            } else {
                setError('只接受JPEG和PNG格式的圖片。');
                setImage(null);
            }
        }
    };

    const handleImageUpload = async () => {
        if (!image) {
            setError('請選擇一張圖片。');
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
                router.push('/main/main-timeline');

            }
        } catch (error) {
            console.error('Error uploading image:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors[0].message);
            } else {
                setError('上傳圖片時發生未知錯誤。');
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ my: 3, mx: 2 }}>
                {/* <Paper elevation={3} style={{ padding: '20px' }}> */}
                <Typography variant="h5" gutterBottom>
                    上傳Avatar圖片
                </Typography>
                {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
                <input type="file" accept="image/jpeg, image/png" onChange={handleImageChange} style={{ marginBottom: '20px' }} />
                <Button onClick={handleImageUpload} fullWidth variant="contained" color="primary">
                    上傳圖片
                </Button>
                {/* </Paper> */}
            </Box>
        </Container>
    );
}
