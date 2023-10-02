import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
    Container,
    Typography,
    AppBar,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Box,
    Toolbar,
    Fab,
    IconButton,
    Divider,
    Snackbar,
    Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

export async function getServerSideProps() {
    // 假設你根據某些邏輯來決定是否顯示底部導覽欄，這個邏輯可以根據你的需求調整
    const showBottomNavigation = true;

    return {
        props: {
            showBottomNavigation,
        },
    };
}

const PostPage = () => {
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [playerCount, setPlayerCount] = useState(0);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [room, setRoom] = useState(null);
    const [isOpenRoom, setIsOpenRoom] = useState(false);
    const [error, setError] = useState(null);
    const [severity, setSeverity] = useState('error');

    // 取得使用者的accountId，假設它存放在localStorage中
    const userAccountId = localStorage.getItem('gee-accountId');

    useEffect(() => {
        // 使用useEffect在組件加載後獲取post資訊
        const fetchPostInfo = async () => {
            try {
                const response = await axios.get(`/api/posts/${router.query.postId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                    },
                });
                setPost(response.data.post);

                const response2 = await axios.get(`/api/forum/posts/${router.query.postId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                    },
                });
                setPlayerCount(response2.data.post.playerCount);

            } catch (error) {
                console.error('讀取Post時發生錯誤:', error);
                showAlert(error, true);
            }
        };

        fetchPostInfo();
    }, [router.query.postId]);

    useEffect(() => {
        // 檢查使用者是否已報名
        if (post) {
            const fetchEnrolled = async () => {
                try {
                    const response = await axios.get(`/api/forum/players/me/${post.id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                        },
                    });

                    if (response.data.player) {
                        setIsEnrolled(true);
                    } else {
                        setIsEnrolled(false);
                    }

                } catch (error) {
                    console.error('查詢報名狀態時發生錯誤:', error);
                    setIsEnrolled(false);
                    showAlert(error, true);
                }
            };

            fetchEnrolled();
        }
    }, [post]);

    useEffect(() => {
        // 檢查使用者是否有創建Room
        if (post) {
            const fetchRoom = async () => {
                try {
                    const response = await axios.get(`/api/forum/rooms/${post.id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                        },
                    });
                    setRoom(response.data.room);
                    setIsOpenRoom(true);
                } catch (error) {
                    setIsEnrolled(false);
                }
            };
            fetchRoom();
        }
    }, [post]);

    const handleEnroll = async () => {
        try {
            await axios.post('/api/forum/players', { postId: post.id }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                },
            });
            setIsEnrolled(true);
            showAlert('報名成功', false);
        } catch (error) {
            console.error('報名時發生錯誤:', error);
            showAlert(error, true);
        }
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
                    <IconButton edge="start" color="inherit" onClick={() => router.back()}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" noWrap>
                        約會貼文
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="sm"
                sx={{ padding: 0 }} // 使用 sx 來覆蓋 Container 的 padding
            >
                {post && (
                    // <Grid container spacing={1}>
                    //     <Grid item key={post.id} xs={12} sm={12} md={12}>
                    <Card elevation={0} sx={{ maxWidth: 500, borderRadius: '26px' }}>
                        <CardActionArea onClick={() => router.push(`/profiles/${post.accountId}`)}>
                            <div style={{ position: 'relative' }}>
                                <CardMedia
                                    component="img"

                                    image={post.profile.avatar}
                                    alt="Image"
                                    sx={{
                                        position: 'relative',
                                        zIndex: 0,
                                        borderRadius: '26px',
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
                                            {post.profile.name}, {post.profile.age}
                                        </Typography>
                                        {/* <Typography variant="body2" component="div">
                      Some description text goes here. You can add more details about the image or anything else.
                    </Typography> */}
                                    </div>
                                </div>
                            </div>
                        </CardActionArea>
                        <CardContent>
                            <Box sx={{ my: 3, mx: 2 }}>
                                <Typography variant="h5" >
                                    {post.title}
                                </Typography>
                                <Typography variant="body1">
                                    {post.content}
                                </Typography>

                            </Box>

                            <Divider variant="middle" />

                            <Box sx={{ m: 2 }}>

                                <Typography variant="body1" color="textSecondary">
                                    {post.status === 'published' ? `距離截止還有${showTimeLeft(post.closedAt)}` : `距離結束還有${showTimeLeft(post.expiresAt)}`}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {`需要 ${post.limitMembers} 人`}
                                </Typography>
                                <Typography variant="body2" >
                                    {`現在已有 ${playerCount} 人報名`}
                                </Typography>
                            </Box>

                            <Divider variant="middle" />

                            <Box sx={{ m: 2 }}>
                                <Typography variant="body1">
                                    狀態：{post.status}
                                </Typography>
                            </Box>


                        </CardContent>

                    </Card>
                    //     </Grid>
                    // </Grid>
                )}
            </Container>


            {post && post.status === 'published' && userAccountId === post.accountId && (
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    style={{
                        position: 'fixed',
                        bottom: '80px',
                        right: '26px',
                    }}
                    onClick={() => router.push(`/players/${post.id}`)}
                >
                    <EditIcon sx={{ mr: 1 }} />
                    挑選報名者
                </Fab>
            )}

            {post && post.status === 'published' && userAccountId !== post.accountId && isEnrolled && (
                <Fab
                    disabled
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    style={{
                        position: 'fixed',
                        bottom: '80px',
                        right: '26px',
                    }}
                >
                    <EditIcon sx={{ mr: 1 }} />
                    已報名
                </Fab>
            )}

            {post && post.status === 'published' && userAccountId !== post.accountId && !isEnrolled && (
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    style={{
                        position: 'fixed',
                        bottom: '80px',
                        right: '26px',
                    }}
                    onClick={handleEnroll}
                >
                    <EditIcon sx={{ mr: 1 }} />
                    報名
                </Fab>
            )}

            {post && post.status !== 'published' && room && room.members.some(e => e.id === userAccountId) && (
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    style={{
                        position: 'fixed',
                        bottom: '80px',
                        right: '26px',
                    }}
                    onClick={() => router.push(`/rooms/${post.id}`)}
                >
                    <EditIcon sx={{ mr: 1 }} />
                    進入聊天室
                </Fab>
            )}


            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={error}
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

export default PostPage;
