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
  Toolbar,
  Chip,
  Fab,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
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

const feedTimeline = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [observeIntersection, setObserveIntersection] = useState(true);
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState('error');

  const observerRef = useRef(null);
  const router = useRouter(); // 初始化路由

  const fetchTimelineData = async () => {
    let ob = true;
    try {
      setObserveIntersection(false);
      setLoading(true);
      const token = localStorage.getItem('gee-token');
      console.log(`GET timelines, page: ${page}, limit: ${limit}`)
      const response = await axios.get(`/api/follows/me/timeline?page=${page}&pageSize=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('response.data.timelineFeeds.length: ' + response.data.timelineFeeds.length);
      setPosts([...posts, ...response.data.timelineFeeds]);
      setPage(page + 1);
      console.log('after GET timelines, page: ' + page);
      if (response.data.timelineFeeds.length < 5) {//posts資料已到最後
        ob = false; // 暫時停用 Intersection Observer
      }

    } catch (error) {
      console.error('獲取timelineFeeds資料時發生錯誤：', error);
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

  // 處理點擊卡片後的跳轉
  const handleCardClick = (postId) => {
    console.log('postId: ' + postId);
    router.push(`/posts/${postId}`);
  };

  // 處理重新整理按鈕點擊事件
  const handleRefreshClick = () => {
    // router.reload(); // 重新整理頁面
    setObserveIntersection(true);
    setPosts([]);
    setPage(1);
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

  // 處理加載完成後的操作，例如啟用 Intersection Observer
  // useEffect(() => {
  //   if (!loading) {
  //     setObserveIntersection(true); // 啟用 Intersection Observer
  //   }
  // }, [loading]);

  return (
    <Box>
      {/* AppBar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          borderRadius: '0px 0px 16px 16px', // 設置弧度框線
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            我關注的最新貼文
          </Typography>
          <IconButton color="inherit" onClick={handleRefreshClick}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md" //讓整個畫面置中
        sx={{ padding: 0 }} // 使用 sx 來覆蓋 Container 的 padding
      >

        {/* 貼文列表 */}
        <Grid container spacing={1}>
          {posts.map((post) => (
            <Grid item key={post.id} xs={6} sm={4} md={3}>
              <Card onClick={() => handleCardClick(post.postId)} sx={{ maxWidth: 345, borderRadius: '26px' }}>
                <CardActionArea>
                  <div style={{ position: 'relative' }}>
                    <CardMedia
                      component="img"

                      image={post.avatar}
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
                          {post.name}, {post.age}
                        </Typography>
                        {/* <Typography variant="body2" component="div">
                      Some description text goes here. You can add more details about the image or anything else.
                    </Typography> */}
                      </div>
                    </div>
                  </div>
                  <CardContent>
                    <Typography variant="h6" >
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {post.status === 'published' ? `距離截止還有${showTimeLeft(post.closedAt)}` : `距離結束還有${showTimeLeft(post.expiresAt)}`}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
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




















































      {/* AppBar */}
      {/* <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            我關注的最新貼文
          </Typography>
          <IconButton color="inherit" onClick={handleRefreshClick}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar> */}

      {/* 貼文列表 */}
      {/* <Grid container spacing={2}>
        {posts.map((post) => (


          <Grid item key={post.id} xs={12} sm={6} md={4}>
            <Card >
              <div style={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="340"
                  image={post.avatar}
                  alt="Image"
                  sx={{
                    position: 'relative',
                    zIndex: 0,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0', // 設置文字容器位於底部
                    left: '0',
                    right: '0',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      color: 'white',
                      padding: '8px',
                      borderRadius: '4px',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h5" component="div">
                      Title
                    </Typography>
                    <Typography variant="body2" component="div">
                      Some description text goes here. You can add more details about the image or anything else.
                    </Typography>
                  </div>
                </div>
              </div>
              <Typography variant="h5" >
                Title2
              </Typography>
              <Typography variant="body2" >
                Some description text goes here. You can add more details about the image or anything else.
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      {loading && <Typography>載入中...</Typography>} */}
      {/* <div className="bottom-marker" style={{ height: '10px' }}></div> 底部元素標記 */}
      {/* <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={error}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        sx={{ bottom: { xs: 90, sm: 0 } }}
      >
        <Alert severity={'error'} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar> */}
    </Box>
  );
};

export default feedTimeline;
