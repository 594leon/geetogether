import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AppBar, IconButton, Toolbar, Typography, Container, TextField, Button, Alert, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export async function getServerSideProps() {
    // 假設你根據某些邏輯來決定是否顯示底部導覽欄，這個邏輯可以根據你的需求調整
    const showBottomNavigation = true;
    return {
        props: {
            showBottomNavigation,
        },
    };
}

const AddPost = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        limitMembers: 0,
    });

    const [errors, setErrors] = useState([]); // 使用陣列來儲存錯誤訊息

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        let _value = value;
        if (name === 'limitMembers') {
            _value = Number(value);
        }

        setFormData({
            ...formData,
            [name]: _value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('gee-token');
            if (!token) {
                // 處理未授權情況
                return;
            }

            const response = await axios.post('/api/posts', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { insertedId } = response.data;
            // 新的貼文已成功建立，可以根據需要處理導覽或顯示成功訊息
            // router.push(`/post/${insertedId}`);
            router.back();

        } catch (error) {
            //axios預設收到200開頭以外的http status-code會當作錯誤直接丟出error
            console.error('Error creating post:', error);
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
            setErrors([{ message: '發生未知錯誤。' }]);
        }
    };

    return (
        <Container maxWidth="sm">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="返回" onClick={() => router.back()}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6">新增貼文</Typography>
                </Toolbar>
            </AppBar>
            {errors && errors.map((error, index) => <Alert key={index.toString()} severity="error" style={{ marginBottom: '20px' }}>{error.field ? error.message + ', ' + error.field : error.message}</Alert>)}
            <form onSubmit={handleSubmit}>
                <TextField
                    name="title"
                    label="標題"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={formData.title}
                    onChange={handleInputChange}
                />
                <TextField
                    name="content"
                    label="內容"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    margin="normal"
                    value={formData.content}
                    onChange={handleInputChange}
                />
                <TextField
                    name="limitMembers"
                    label="限制成員數"
                    type="number"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={formData.limitMembers}
                    onChange={handleInputChange}
                />
                <Button type="submit" variant="contained" color="primary">
                    發表貼文
                </Button>
            </form>
        </Container>
    );
};

export default AddPost;
