import React, { useState, useEffect } from 'react';
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
import AddIcon from '@mui/icons-material/Add';
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

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [severity, setSeverity] = useState('error');
    const router = useRouter();

    useEffect(() => {
        // 讀取localStorage中的token和profileId
        const token = localStorage.getItem('gee-token');
        const profileId = localStorage.getItem('gee-accountId');

        // 檢查是否有token和profileId
        if (!token || !profileId) {
            // 可以導向登入頁面或採取其他措施
            return;
        }

        // 設置API請求的headers
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        // 發送GET請求到後端API
        axios.get(`/api/timelines/${profileId}`, { headers })
            .then((response) => {
                // 從API獲取貼文數據
                const fetchedPosts = response.data.posts;
                setPosts(fetchedPosts);
            })
            .catch((error) => {
                // 處理錯誤
                console.error('Error fetching posts:', error);
                showAlert(error, true)
            });
    }, []);

    const handlePostClick = (postId) => {
        // 導航到單個貼文頁面
        router.push(`/posts/${postId}`);
    };

    const handleAddPostClick = () => {
        // 導航到新貼文頁面
        router.push('/posts/add');
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
                }}
            >
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        我的貼文
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="md" //讓整個畫面置中
                sx={{ padding: 0 }} // 使用 sx 來覆蓋 Container 的 padding
            >

                <Grid container spacing={1}>

                    {posts.map((post) => (

                        <Grid item key={post.id} xs={6} sm={4} md={3}>
                            <Card onClick={() => handlePostClick(post.id)} sx={{ maxWidth: 345, borderRadius: '16px' }}>
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

                {/* <Grid container spacing={2}>
                    {posts.map((post) => (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                            <Card onClick={() => handlePostClick(post.id)}>
                               
                                <CardContent>
                                    <Typography variant="h6">{post.title}</Typography>
                                    <Typography variant="body2">作者: {post.profile.name}</Typography>
                                   
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid> */}

            </Container>

            {/* 添加新貼文的Floating Action Button */}
            <Fab
                color="primary"
                aria-label="add"
                style={{
                    position: 'fixed',
                    bottom: '120px',
                    right: '26px',
                }}
                onClick={handleAddPostClick}
            >
                <AddIcon />
            </Fab>

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

export default MyPosts;
