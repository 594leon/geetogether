import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    // 這個效果只會在應用程式載入時執行一次，用來檢查localStorage的gee-token
    const checkToken = async () => {
      const token = localStorage.getItem('gee-token');
      console.log(token);
      if (token) {
        try {
          // 使用Axios檢查後端API以驗證令牌的有效性
          const response = await axios.get('/api/auth/validate', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.accountId) {
            // 令牌有效
            const res = await axios.get(`/api/profiles/${response.data.accountId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            console.log(res);

            if (res.data.profile) {
              if (res.data.profile.name === 'empty-name') {
                // 未完成profile資料 導向 User Profiles 頁面
                router.push('/profiles/add');
                return;
              }

              if (res.data.profile.avatar === 'empty.png') {
                //未完成avatar資料，導向上傳圖片頁面
                router.push('/pictures/upload');
                return;
              }

              //令牌有效且完成profile資料，導向主要頁面
              router.push('/main/main-timeline');
              return;

            }
            router.push('/auth/register-login');

          } else {
            // 令牌無效，導向登入頁面
            router.push('/auth/register-login');
          }
        } catch (error) {
          console.error('檢查令牌時發生錯誤：', error);
        }
      } else {
        // 沒有令牌，導向登入頁面
        router.push('/auth/register-login');
      }
    };

    checkToken();
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="primary.main"         // 設置背景顏色為Tiffany藍
    >
      <Typography variant="h1" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>
        GeeTogether
      </Typography>
    </Box>
  );
};

export default LandingPage;