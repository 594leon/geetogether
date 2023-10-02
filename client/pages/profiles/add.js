// pages/add-profile.js
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Grid, Container, Paper, Typography, Alert, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const genders = ['male', 'female']; // 新增兩個性別選項

export default function AddProfile() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        age: 0,
        gender: '', // 改為選擇性別
        zodiacSign: '',
        myTags: [],
    });

    const [errors, setErrors] = useState([]);

    //reactjs的onChange函式
    const handleChange = (e) => {
        //e是onChange事件，其中target可以取得該元件(ex:textfield)的屬性
        const { name, value } = e.target;//取得textfield元件的name跟value屬性

        let _value = value;
        if (name === 'myTags') {
            _value = value.split(',');
        } else if (name === 'age') {
            _value = Number(value);
        }


        setFormData({
            ...formData,//把formData 狀態的所有內容複製到一個新的物件中的方式
            [name]: _value,// [變數]:把變數的值變成物件屬性(key)名稱
        });//整行程式就是把formData 狀態的所有內容保留下來，並更新onChange改變的鍵值
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('gee-token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post('/api/profiles', formData, {
                headers,
            });

            showErrors();//清除錯誤顯示
            console.log('Profile created successfully.');
            //導向上傳圖片頁面
            router.push('/pictures/upload');

        } catch (error) {
            //axios預設收到200開頭以外的http status-code會當作錯誤直接丟出error
            console.error('Error creating profile:', error);
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
        <Container component="main" maxWidth="xs">
            <Box sx={{ my: 3, mx: 2 }}>
                {/* <Paper elevation={3} style={{ padding: '20px' }}> */}
                <Typography variant="h5" gutterBottom>
                    新增Profile
                </Typography>
                {errors && errors.map((error, index) => <Alert key={index.toString()} severity="error" style={{ marginBottom: '20px' }}>{error.field ? error.message + ', ' + error.field : error.message}</Alert>)}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="名字"
                                name="name"
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="年齡"
                                name="age"
                                type="number"
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>性別</InputLabel>
                                <Select
                                    label="性別"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    {genders.map((gender) => (
                                        <MenuItem key={gender} value={gender}>
                                            {gender}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>星座</InputLabel>
                                <Select
                                    label="星座"
                                    name="zodiacSign"
                                    value={formData.zodiacSign}
                                    onChange={handleChange}
                                    required
                                >
                                    {zodiacSigns.map((sign) => (
                                        <MenuItem key={sign} value={sign}>
                                            {sign}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                fullWidth
                                label="標籤 (逗號分隔)"
                                name="myTags"
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
                        創建Profile
                    </Button>
                </form>
                {/* </Paper> */}
            </Box>
        </Container>
    );
}
