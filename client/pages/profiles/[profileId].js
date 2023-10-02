// [profileId].js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
    Container,
    Grid,
    Typography,
    AppBar,
    Avatar,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CardActions,
    CardHeader,
    Paper,
    Stack,
    Box,
    CssBaseline,
    Toolbar,
    Chip,
    Fab,
    IconButton,
    Divider,
    Snackbar,
    Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';

export async function getServerSideProps() {
    // 假設你根據某些邏輯來決定是否顯示底部導覽欄，這個邏輯可以根據你的需求調整
    const showBottomNavigation = true;

    return {
        props: {
            showBottomNavigation,
        },
    };
}

const ProfilePage = () => {
    const router = useRouter();
    const { profileId } = router.query;

    const [profile, setProfile] = useState(null);
    const [record, setRecord] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false); // 追蹤狀態
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [severity, setSeverity] = useState('error');

    // 檢查是否已追蹤
    const checkFollowingStatus = async () => {
        try {
            const response = await axios.get(`/api/follows/me/following/${profileId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                },
            });
            setIsFollowing(response.data.isFollowing);
        } catch (error) {
            console.error('檢查是否已追蹤時發生錯誤', error);
            showAlert(error, true);
        }
    };

    // 取得個人資料
    const fetchProfile = async () => {
        try {
            const response = await axios.get(`/api/profiles/${profileId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                },
            });
            setProfile(response.data.profile);
        } catch (error) {
            console.error('取得個人資料時發生錯誤', error);
            showAlert(error, true);
        }
    };

    // 取得追蹤/跟隨者記錄
    const fetchRecord = async () => {
        try {
            const response = await axios.get(`/api/follows/${profileId}/record`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                },
            });
            setRecord(response.data.record);
        } catch (error) {
            console.error('取得追蹤/跟隨者記錄時發生錯誤', error);
            showAlert(error, true);
        }
    };

    // 取得個人貼文列表
    const fetchPosts = async () => {
        try {
            const response = await axios.get(`/api/timelines/${profileId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                },
            });
            setPosts(response.data.posts);
        } catch (error) {
            console.error('取得個人貼文列表時發生錯誤', error);
            showAlert(error, true);
        }
    };

    useEffect(() => {
        if (profileId) {
            fetchProfile();
            fetchRecord();
            fetchPosts();
            checkFollowingStatus();
        }
    }, [profileId]);

    // 返回上一頁
    const goBack = () => {
        router.back();
    };

    // 追蹤或取消追蹤
    const toggleFollow = async () => {
        try {
            console.log(localStorage.getItem('gee-token'))
            if (isFollowing) {
                // 如果已追蹤，則呼叫取消追蹤 API
                await axios.delete(`/api/follows/${profileId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                        },
                    }
                );
                showAlert('已取消追蹤', false);
            } else {
                // 如果未追蹤，則呼叫追蹤 API
                await axios.post('/api/follows',
                    {
                        followingId: profileId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                        },
                    }
                );
                showAlert('已追蹤', false);
            }
            // 更新追蹤狀態
            setIsFollowing(!isFollowing);

        } catch (error) {
            console.error('切換追蹤狀態時發生錯誤', error);
            showAlert(error, true);
        }
    };

    const handleFollowingsClick = () => {
        router.push(`/follows/followings/${profileId}`);
    };

    const handleFollowersClick = () => {
        router.push(`/follows/followers/${profileId}`);
    };

    // 處理點擊卡片後的跳轉
    const handleCardClick = (postId) => {
        console.log('postId: ' + postId);
        router.push(`/posts/${postId}`);
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

    const showTimeLeft = (targetDate) => {
        // 計算距離現在的剩餘時間（以毫秒為單位）
        const now = new Date();
        const timeDifference = new Date(targetDate) - now;

        // 計算剩餘的天數、小時和分鐘
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        // 呈現剩餘時間
        return `${days} 天 ${hours} 小時 ${minutes} 分鐘`;
    }

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
                    <IconButton edge="start" color="inherit" onClick={() => router.back()}>
                        <ArrowBackIcon />
                    </IconButton>
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
                                color={isFollowing ? 'secondary' : 'primary'}
                                variant='extended'
                                aria-label="edit"
                                style={{
                                    position: 'absolute',
                                    bottom: '-25px', // 設置文字容器位於底部

                                    right: '50px',
                                }}
                                onClick={toggleFollow}
                            >
                                {isFollowing ? (<FavoriteIcon sx={{ mr: 1 }} />) : (<FavoriteBorderTwoToneIcon sx={{ mr: 1 }} />)}
                                {isFollowing ? '已追蹤' : '追蹤'}
                            </Fab>
                        </div>

                        <CardContent>
                            <Box sx={{ my: 3, mx: 2 }}>
                                <Typography variant="h5" >
                                    {profile.name}, {profile.age}
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
                                        <Grid item xs={4} sm={4} md={4}>
                                            <Card
                                                elevation={3}
                                                sx={{
                                                    p: 0,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    // height: 120,
                                                    // backgroundColor: '#ff5733', // 自定義的背景色
                                                }}
                                            >
                                                <CardActionArea>
                                                    <CardContent>
                                                        <Typography align="center" variant="subtitle1">{posts && posts.length}</Typography>
                                                        <Typography align="center" variant="subtitle1">約會</Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={4} sm={4} md={4}>
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
                                            {/* <Paper elevation={3}
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        // height: 240,
                                    }}
                                >
                                    <Typography align="center" variant="subtitle1">{record.followerCount}</Typography>
                                    <Typography align="center" variant="subtitle1">粉絲</Typography>
                                </Paper> */}
                                        </Grid>

                                        <Grid item xs={4} sm={4} md={4}>
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

                                        <Typography variant="h6">關於我</Typography>
                                        {/* <IconButton color="inherit" onClick={handleEditTagsClick}>
                                                            <BorderColorIcon />
                                                        </IconButton> */}

                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12}>
                                        {profile.myTags && profile.myTags.map(tag => (
                                            <Chip sx={{ margin: 0.1 }} label={tag} variant="outlined" />
                                        ))}

                                    </Grid>
                                </Grid>

                            </Box>

                            <Divider variant="middle" />

                            <Box sx={{ m: 2 }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">貼文列表</Typography>
                                    </Grid>
                                    {posts.map((post) => (

                                        <Grid item key={post.id} xs={12}>
                                            <Card onClick={() => handleCardClick(post.id)} sx={{ maxWidth: 345, borderRadius: '16px' }}>
                                                <CardActionArea>

                                                    <CardContent>
                                                        <Typography variant="h6" >
                                                            {post.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {post.status === 'published' ? `距離截止還有${showTimeLeft(post.closedAt)}` : `距離結束還有${showTimeLeft(post.expiresAt)}`}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {`需要 ${post.limitMembers} 人`}
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            狀態：{post.status}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>



                        </CardContent>

                    </Card>
                    //     </Grid>
                    // </Grid>
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
        </Box>
    );
};

export default ProfilePage;
