// pages/my-profile.js

import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Typography,
    AppBar,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Stack,
    Box,
    Toolbar,
    Chip,
    Fab,
    IconButton,
    Divider,
    Snackbar,
    Alert,
} from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useRouter } from 'next/router';

export async function getServerSideProps() {
    // 假設你根據某些邏輯來決定是否顯示底部導覽欄，這個邏輯可以根據你的需求調整
    const showBottomNavigation = true;
    return {
        props: {
            showBottomNavigation,
        },
    };
}

const MyProfile = () => {
    const router = useRouter();
    const [profile, setProfile] = useState({});
    const [record, setRecord] = useState({});
    const [error, setError] = useState(null);
    const [severity, setSeverity] = useState('error');

    useEffect(() => {
        // 取得使用者ID和Token
        const accountId = localStorage.getItem('gee-accountId');
        const token = localStorage.getItem('gee-token');

        // 取得使用者Profile資訊
        const getProfile = async () => {
            try {
                const response = await axios.get(`/api/profiles/${accountId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(response.data.profile);
            } catch (error) {
                console.error(error);
                showAlert(error, true);
            }
        };

        // 取得使用者的追蹤者/追蹤中記錄
        const getRecord = async () => {
            try {
                const response = await axios.get(`/api/follows/${accountId}/record`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRecord(response.data.record);
            } catch (error) {
                console.error(error);
                showAlert(error, true);
            }
        };

        // 執行上面的async函式
        getProfile();
        getRecord();
    }, []);

    const handleEditPicClick = () => {
        // 導航到修改圖片頁面
        router.push('/pictures/update');
    };

    const handleEditNameClick = () => {
        // 導航到修改name頁面
        localStorage.setItem('gee-profile-name', profile.name);
        router.push('/profiles/update-name');
    };

    const handleEditTagsClick = () => {
        // 導航到修改name頁面
        localStorage.setItem('gee-profile-tags', profile.myTags.join(','));
        router.push('/profiles/update-tags');
    };

    const handleFollowingsClick = () => {
        const accountId = localStorage.getItem('gee-accountId');
        router.push(`/follows/followings/${accountId}`);
    };

    const handleFollowersClick = () => {
        const accountId = localStorage.getItem('gee-accountId');
        router.push(`/follows/followers/${accountId}`);
    };

    const showAlert = (error, isError) => {

        setSeverity(isError ? 'error' : 'success');

        if (!error) {
            setError(null);

        } else if (error.response?.data?.errors[0]) {
            setError(error.response.data.errors[0].message);

        } else if (error.response?.data) {
            setError(error.response.data.toString());

        } else {
            setError(error);
        }
    };

    const handleCloseSnackbar = () => {
        setError(null);
    };

    return (
        <Box>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    borderRadius: '0px 0px 16px 16px', // 設置弧度框線
                    // backgroundColor: '#FFC439', // 背景設置黃色
                    // backgroundColor: '#EAB0AF', // 背景設置粉色
                    // border: '2px solid #ccc', // 設置2px寬度的灰色實線框線
                }}
            >
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        個人資料
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="sm"
                sx={{ padding: 0 }} // 使用 sx 來覆蓋 Container 的 padding
            >
                {profile && (
                    // <Grid container spacing={1}>
                    //     <Grid item key={post.id} xs={12} sm={12} md={12}>
                    <Card elevation={0} sx={{ maxWidth: 500, borderRadius: '26px' }}>

                        {/* <div style={{ position: 'relative' }}> */}
                        <div style={{ position: 'relative' }}>
                            <CardMedia
                                component="img"

                                image={profile.avatar}
                                alt="Image"
                                sx={{
                                    position: 'relative',
                                    zIndex: 0,
                                    borderRadius: '26px',
                                }}
                            />
                            <Fab
                                color='primary'
                                aria-label="edit"
                                style={{
                                    position: 'absolute',
                                    bottom: '-25px', // 設置文字容器位於底部
                                    right: '50px',
                                }}
                                onClick={handleEditPicClick}
                            >
                                <EditIcon />
                            </Fab>
                        </div>

                        <CardContent>
                            <Box sx={{ my: 3, mx: 2 }}>
                                <Stack direction="row" spacing={0}>
                                    <Typography gutterBottom variant="h4" component="div">
                                        {profile.name}
                                    </Typography>
                                    <IconButton color="inherit" onClick={handleEditNameClick}>
                                        <BorderColorIcon />
                                    </IconButton>
                                </Stack>
                                <Typography variant="h5" >
                                    {profile.age}
                                </Typography>
                                <Typography variant="body1">
                                    {profile.gender}
                                </Typography>
                                <Typography variant="body1">
                                    {profile.zodiacSign}
                                </Typography>
                            </Box>
                            <Divider variant="middle" />

                            <Box sx={{ m: 2 }}>
                                {record && (
                                    <Grid container spacing={2}>

                                        <Grid item xs={6} sm={6} md={6}>
                                            <Card
                                                onClick={() => handleFollowersClick()}
                                                elevation={3}
                                                sx={{
                                                    p: 0,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    // height: 120,
                                                }}
                                            >
                                                <CardActionArea>
                                                    <CardContent>
                                                        <Typography align="center" variant="subtitle1">{record.followerCount}</Typography>
                                                        <Typography align="center" variant="subtitle1">粉絲</Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={6} sm={6} md={6}>
                                            <Card
                                                onClick={() => handleFollowingsClick()}
                                                elevation={3}
                                                sx={{
                                                    p: 0,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    // height: 120,
                                                }}
                                            >
                                                <CardActionArea>
                                                    <CardContent>
                                                        <Typography align="center" variant="subtitle1">{record.followingCount}</Typography>
                                                        <Typography align="center" variant="subtitle1">追蹤中</Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>

                                    </Grid>
                                )}
                            </Box>

                            <Divider variant="middle" />

                            <Box
                                sx={{ m: 2 }}
                            >
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <Stack direction="row" spacing={0}>
                                            <Typography variant="h5">關於我</Typography>
                                            <IconButton color="inherit" onClick={handleEditTagsClick}>
                                                <BorderColorIcon />
                                            </IconButton>
                                        </Stack>

                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12}>
                                        {profile.myTags && profile.myTags.map(tag => (
                                            <Chip sx={{ margin: 0.1 }} label={tag} variant="outlined" />
                                        ))}

                                    </Grid>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Container>

            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={error ? true : false}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                sx={{ bottom: { xs: 90, sm: 0 } }}
            >
                <Alert severity={severity} sx={{ width: '100%' }} onClose={handleCloseSnackbar}>
                    {error}
                </Alert>
            </Snackbar>
            {/* End footer */}
        </Box>








    );
};

export default MyProfile;
