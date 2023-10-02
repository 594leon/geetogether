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
  Alert,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  AvatarGroup,
  ListItemButton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
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

const MainTimeline = () => {
  // const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [observeIntersection, setObserveIntersection] = useState(true);
  const [isMemberDialogOpen, setMemberDialogOpen] = useState(false);
  const [isScrollDown, setIsScrollDown] = useState(false);
  const listRef = useRef(null);
  const [room, setRoom] = useState(undefined);
  const [members, setMembers] = useState(undefined);
  const [comments, setComments] = useState([]);
  const observerRef = useRef(null);
  const router = useRouter(); // 初始化路由
  const { postId } = router.query;
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState('error');
  const accountId = localStorage.getItem('gee-accountId');

  // Fetch room data
  useEffect(() => {
    if (postId) {
      const fetchRoomData = async () => {
        try {
          const response = await axios.get(`/api/forum/rooms/${postId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
            },
          });
          console.log(`GET /api/forum/rooms/${postId}`)
          console.log(response.data.room)
          setRoom(response.data.room);
          let _members = {};
          response.data.room.members.forEach(member => {
            _members[member.id] = member;
          });
          setMembers(_members);
          console.log(members)
        } catch (error) {
          showAlert(error, true);
        }
      };
      fetchRoomData();
    }
  }, [postId]);

  const fetchTimelineData = async () => {
    if (!room) {
      return;
    }

    let ob = true;
    try {
      setObserveIntersection(false);
      setLoading(true);

      console.log(`GET timelines, page: ${page}, limit: ${limit}`)
      const response = await axios.get(`/api/forum/comments/${room.id}?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
        },
      });
      console.log('response.data.comments.length: ' + response.data.comments.length);
      const reversed = response.data.comments.reverse();
      setComments([...reversed, ...comments]);
      console.log(response.data.comments);
      setPage(page + 1);
      console.log('after GET timelines, page: ' + page);
      if (response.data.comments.length < 5) {//posts資料已到最後
        ob = false; // 暫時停用 Intersection Observer
      }

    } catch (error) {
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
  }, [fetchTimelineData, room]);

  // 處理點擊卡片後的跳轉
  const handleCardClick = (postId) => {
    console.log('postId: ' + postId);
    router.push(`/posts/${postId}`);
  };

  // 處理重新整理按鈕點擊事件
  const handleRefreshClick = () => {
    // router.reload(); // 重新整理頁面
    setObserveIntersection(true);
    setComments([]);
    setPage(1);
  };

  // Scroll to the bottom of the List
  const scrollToBottom = () => {
    if (listRef.current) {
      console.log('scrollToBottom');
      console.log(listRef.current);
      listRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  };


  // Scroll to the bottom of the List when comments change
  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  // 處理加載完成後的操作，例如啟用 Intersection Observer
  // useEffect(() => {
  //   if (!loading) {
  //     setObserveIntersection(true); // 啟用 Intersection Observer
  //   }
  // }, [loading]);

  const handleOpenMemberDialog = () => {
    setMemberDialogOpen(true);
  };

  const handleCloseMemberDialog = () => {
    setMemberDialogOpen(false);
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (newComment.trim() === '') {
      setError('Comment cannot be empty');
      return;
    }

    try {
      const response = await axios.post('/api/forum/comments', {
        roomId: room.id,
        text: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
        },
      });
      setNewComment('');
      setError(null);
      setObserveIntersection(true);
      setComments([]);
      setPage(1);
      // You can handle any further actions upon successful comment submission here
    } catch (error) {
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
            聊天
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
        <Box sx={{ my: 1, mx: 2 }}>
          <Stack direction="row" spacing={2}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              成員:
            </Typography>
            <IconButton color="inherit" onClick={handleOpenMemberDialog}>
              <AvatarGroup max={6} onClick={handleOpenMemberDialog}>
                {room && room.members.map((member) => (
                  <Avatar alt={member.name} src={member.avatar} />
                ))}
              </AvatarGroup>
            </IconButton>
          </Stack>

          <Divider variant="middle" />

          {/* 貼文列表 */}
          <List style={{ overflowY: 'auto', maxHeight: '400px' }}>
            <div className="bottom-marker" style={{ height: '10px' }}></div> {/* 底部元素標記 */}
            {loading && <Typography>載入中...</Typography>}
            {/* Render chat messages from 'comments' state */}
            {members && comments.map((comment) => (
              // <ListItem key={comment.id} alignItems="flex-start" sx={{ flexDirection: comment.accountId === accountId ? 'row-reverse' : 'row' }}>
              <ListItem key={comment.id}>
                <ListItemAvatar>
                  <Avatar alt={members[comment.accountId].name} src={members[comment.accountId].avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={comment.text}
                  secondary={comment.createdAt}
                  primaryTypographyProps={{ noWrap: false }}
                />
              </ListItem>
            ))}
            <li ref={listRef} />
          </List>

          <Stack direction="row" spacing={1}>
            {/* Comment input */}
            <TextField
              label="Comment"
              variant="outlined"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <Button variant="contained" color="primary" onClick={handleCommentSubmit}>
              <SendIcon />
            </Button>
          </Stack>

        </Box>
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

      <Dialog open={isMemberDialogOpen} onClose={handleCloseMemberDialog}>
        {/* <DialogTitle>Room Members</DialogTitle> */}
        <DialogContent>
          <List sx={{ pt: 0, m: 0 }}>
            {room && room.members.map((member) => (
              <ListItem
                key={member.id}
                disableGutters
              >
                <ListItemButton onClick={() => router.push(`/profiles/${member.id}`)}>
                  <ListItemAvatar>
                    <Avatar alt={member.name} src={member.avatar} />
                  </ListItemAvatar>
                  <ListItemText primary={member.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleCloseMemberDialog} color="primary">
            Close
          </Button>
        </DialogActions> */}
      </Dialog>
    </Box>
  );
};

export default MainTimeline;
