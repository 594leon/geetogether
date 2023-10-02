import React, { useState, useEffect, useRef } from 'react';
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
    Paper,
    Stack,
    Box,
    CssBaseline,
    Toolbar,
    Chip,
    Fab,
    IconButton,
    Snackbar,
    Alert,
    Divider,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router'; // 引入路由

export async function getServerSideProps() {
    // 假設你根據某些邏輯來決定是否顯示底部導覽欄，這個邏輯可以根據你的需求調整
    const showBottomNavigation = true;
    return {
        props: {
            showBottomNavigation,
        },
    };
}

const MyEnrolls = () => {
    const [enrolls, setEnrolls] = useState([]);
    const [error, setError] = useState(null);
    const [severity, setSeverity] = useState('error');
    const router = useRouter(); // 初始化路由

    const fetchTimelineData = async () => {
        try {
            const token = localStorage.getItem('gee-token');
            const response = await axios.get('/api/forum/enrolls/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEnrolls(response.data.enrolls);

        } catch (error) {
            console.error('獲取資料時發生錯誤：', error);

            showAlert(error, true);
        }
    };

    useEffect(() => {
        fetchTimelineData();
    }, []);

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
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        我報名的貼文
                    </Typography>
                </Toolbar>
            </AppBar>


            <Container
                maxWidth="md" //讓整個畫面置中
                sx={{ padding: 0 }} // 使用 sx 來覆蓋 Container 的 padding
            >

                {/* 貼文列表 */}
                <Grid container spacing={2}>
                    {enrolls.map((enroll) => (
                        <Grid item key={enroll.id} xs={6} sm={4} md={3}>
                            <Card onClick={() => handleCardClick(enroll.post.id)} sx={{ maxWidth: 345, borderRadius: '26px' }}>
                                <CardActionArea>
                                    <div style={{ position: 'relative' }}>
                                        <CardMedia
                                            component="img"

                                            image={enroll.author.avatar}
                                            alt="Image"
                                            sx={{
                                                position: 'relative',
                                                zIndex: 0,
                                                borderRadius: '16px',
                                            }}
                                        />
                                        <div
                                            style={{
                                                position: 'absolute',
                                                bottom: '0', // 設置文字容器位於底部
                                                left: '0',
                                                right: '0',
                                                borderRadius: '26px 26px 26px 26px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                    color: 'white',
                                                    padding: '8px',
                                                    borderRadius: '4px',
                                                    textAlign: 'left',
                                                    borderRadius: '0px 0px 26px 26px',
                                                }}
                                            >
                                                <Typography variant="h5" component="div">
                                                    {enroll.author.name}, {enroll.author.age}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                    <CardContent>
                                        <Box sx={{ m: 0, my: 1 }}>
                                            <Typography variant="h6" component="div">
                                                {enroll.post.title}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {`${enroll.post.limitMembers} 人報名`}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {`需要 ${enroll.post.playerCount} 人`}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                貼文狀態：{enroll.post.status}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {enroll.post.status === 'published' ? `距離截止還有${showTimeLeft(enroll.post.closedAt)}` : `距離結束還有${showTimeLeft(enroll.post.expiresAt)}`}
                                            </Typography>
                                        </Box>
                                        <Divider variant="middle" />

                                        <Box sx={{ m: 0, my: 1 }}>
                                            <Typography variant="h6" color="textSecondary">
                                                報名狀態：{enroll.player.status}
                                            </Typography>
                                        </Box>

                                        {/* <Avatar alt={enroll.author.name} src={enroll.author.avatar} />
                                        <Typography variant="h6" component="div">
                                            {enroll.post.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {`${enroll.post.limitMembers} 人報名`}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {`需要 ${enroll.post.playerCount} 人`}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            貼文狀態：{enroll.post.status}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {enroll.post.status === 'published' ? `距離截止還有${showTimeLeft(enroll.post.closedAt)}` : `距離結束還有${showTimeLeft(enroll.post.expiresAt)}`}
                                        </Typography>

                                        <Divider />
                                        <Typography variant="h5" color="textSecondary">
                                            報名狀態：{enroll.player.status}
                                        </Typography> */}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
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

export default MyEnrolls;
