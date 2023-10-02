import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Typography,
    AppBar,
    Avatar,
    Toolbar,
    IconButton,
    Snackbar,
    Alert,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton,
    Box,
    Container,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

const followersPage = () => {
    const [followers, setFollowers] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [loading, setLoading] = useState(false);
    const [observeIntersection, setObserveIntersection] = useState(true);
    const [error, setError] = useState(null);
    const [severity, setSeverity] = useState('error');

    const observerRef = useRef(null);
    const router = useRouter(); // 初始化路由
    const { profileId } = router.query;

    const fetchTimelineData = async () => {
        let ob = true;
        try {
            setObserveIntersection(false);
            setLoading(true);
            const token = localStorage.getItem('gee-token');
            console.log(`GET followers, page: ${page}, limit: ${limit}`)
            const response = await axios.get(`/api/follows/followers/${profileId}?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('response.data.followers.length: ' + response.data.followers.length);
            setFollowers([...followers, ...response.data.followers]);
            setPage(page + 1);
            console.log('after GET followers, page: ' + page);
            if (response.data.followers.length < 5) {//posts資料已到最後
                ob = false; // 暫時停用 Intersection Observer
            }

        } catch (error) {
            console.error('獲取followers資料時發生錯誤：', error);
            ob = false; // 發生錯誤停用 Intersection Observer
            showAlert(error, true);
        } finally {
            setLoading(false);
            setObserveIntersection(ob);
        }
    };

    // 使用「Intersection Observer」來監聽底部元素的可見性
    useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && observeIntersection) {
                fetchTimelineData(); // 當底部元素進入視窗時，載入更多資料
            }
        }, { threshold: 1 });

        if (observerRef.current) {
            observerRef.current.observe(document.querySelector('.bottom-marker'));
        }

        // 回傳清除「Intersection Observer」的function，React 將在需要清除時執行它
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [fetchTimelineData]);

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
                }}
            >
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={() => router.back()}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" noWrap>
                        粉絲
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="md" //讓整個畫面置中
                sx={{ padding: 0 }} // 使用 sx 來覆蓋 Container 的 padding
            >

                <List>
                    {followers.map((follower) => (
                        <ListItem
                            key={follower.id}
                            disablePadding
                        >
                            <ListItemButton onClick={() => router.push(`/profiles/${follower.follower.id}`)}>
                                <ListItemAvatar>
                                    {console.log('following.following.avatar: ' + follower.follower.avatar)}
                                    <Avatar alt={follower.follower.name} src={follower.follower.avatar} />
                                </ListItemAvatar>
                                <ListItemText primary={follower.follower.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                {loading && <Typography>載入中...</Typography>}
                <div className="bottom-marker" style={{ height: '10px' }}></div> {/* 底部元素標記 */}
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

export default followersPage;
