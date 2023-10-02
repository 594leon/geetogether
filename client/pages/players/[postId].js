import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
    AppBar,
    IconButton,
    Typography,
    Button,
    Snackbar,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Checkbox,
    ListItemButton,
    Alert,
    Box,
    Toolbar,
    Container,
} from '@mui/material';
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

const PlayerPage = () => {
    const router = useRouter();
    const { postId } = router.query;

    const [limitMembers, setLimitMembers] = useState(0);
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Fetch post information and limitMembers
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/forum/posts/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                    },
                });
                const { post } = response.data;
                setLimitMembers(post.limitMembers);
            } catch (error) {
                console.error('Error fetching post information:', error);
            }
        };

        fetchData();
    }, [postId]);

    // Fetch players list
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await axios.get(`/api/forum/players/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                    },
                });
                const { players } = response.data;
                setPlayers(players);
            } catch (error) {
                console.error('Error fetching players:', error);
            }
        };

        fetchPlayers();
    }, [postId]);

    const handlePlayerSelection = (playerId) => {
        if (selectedPlayers.includes(playerId)) {
            setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId));
        } else {
            setSelectedPlayers([...selectedPlayers, playerId]);
        }
    };

    const handleChoosePlayers = async () => {
        if (selectedPlayers.length > limitMembers) {
            setError(`你只能選擇${limitMembers}個報名者`);
        }
        try {
            const response = await axios.post('/api/forum/rooms', {
                postId,
                playerIds: selectedPlayers,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('gee-token')}`,
                },
            });

            setCompleted(true);
            setOpenSnackbar(true);

        } catch (error) {
            console.error('Error choosing players:', error);
            if (error.response?.data?.errors[0]) {
                setError(error.response?.data?.errors[0].message);
            } else {
                setError('選擇玩家時發生錯誤');
            }
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
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
                        挑選{limitMembers}個報名者
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="md" //讓整個畫面置中
                sx={{ padding: 0 }} // 使用 sx 來覆蓋 Container 的 padding
            >
                <Box sx={{ my: 1, mx: 2 }}>
                    <List>
                        {players.map((player) => (
                            <ListItem
                                key={player.id}
                                secondaryAction={
                                    <Checkbox
                                        edge="end"
                                        checked={selectedPlayers.includes(player.id)}
                                        onChange={() => handlePlayerSelection(player.id)}
                                        inputProps={{ 'aria-labelledby': `checkbox-list-label-${player.id}` }}
                                    />
                                }
                                disablePadding
                            // button component="a" href={`/profiles/${player.accountId}`}
                            >
                                <ListItemButton onClick={() => router.push(`/profiles/${player.accountId}`)}>
                                    <ListItemAvatar>
                                        <Avatar alt={player.profile.name} src={player.profile.avatar} />
                                    </ListItemAvatar>
                                    <ListItemText primary={player.profile.name} />
                                </ListItemButton>

                                {/* <Checkbox
                                edge="end"
                                checked={selectedPlayers.includes(player.id)}
                                onChange={() => handlePlayerSelection(player.id)}
                                inputProps={{ 'aria-labelledby': `checkbox-list-label-${player.id}` }}
                            /> */}
                            </ListItem>
                        ))}
                    </List>


                    <Button variant="contained"
                        color="primary"
                        onClick={handleChoosePlayers}
                        disabled={completed}
                    >
                        {completed ? '已完成約會' : '完成約會'}
                    </Button>
                </Box>
            </Container>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                sx={{ bottom: { xs: 90, sm: 0 } }}
            >
                <Alert severity={completed ? 'success' : 'error'} sx={{ width: '100%' }}>
                    {completed ? '挑選成功' : error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PlayerPage;
