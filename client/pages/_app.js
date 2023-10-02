// pages/_app.js
import React from 'react';
import { BottomNavigation, BottomNavigationAction, CssBaseline } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/router';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [value, setValue] = React.useState('main-timeline');

  const handleNavigation = (event, newValue) => {
    setValue(newValue);
    if (newValue === 'main-timeline') {
      // 導航到主時間線頁面
      router.push('/main/main-timeline');

    } else if (newValue === 'feed-timeline') {
      // 導航到我關注的貼文時間線頁面
      router.push('/main/feed-timeline');

    } else if (newValue === 'profile') {
      // 導航到個人檔案頁面，並使用localStorage中的gee-accountId作為profileId參數
      const profileId = localStorage.getItem('gee-accountId');
      router.push(`/main/account`);

    } else if (newValue === 'myposts') {
      // 導航到myposts頁面
      router.push(`/main/myposts`);
    } else if (newValue === 'my-enrolls') {
      // 導航到my-enrolls頁面
      router.push(`/main/my-enrolls`);
    }
  };

  // 從 pageProps 中讀取 showBottomNavigation 的值
  const showBottomNavigation = pageProps.showBottomNavigation;


  // 創建主題
  const defaultTheme = createTheme({
    palette: {
      // background: {
      //     default: "#FFFFFF"
      // },
      primary: {
        main: '#C07AB8',
        // light: will be calculated from palette.primary.main,
        // dark: will be calculated from palette.primary.main,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#FFC439',
        // light: '#F5EBFF',
        // dark: will be calculated from palette.secondary.main,
        contrastText: '#FFFFFF',
      },

    }
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      
      <div style={{ paddingBottom: showBottomNavigation ? '56px' : '0' }}>
        {/* 這裡可以添加應用程序的其他全局元素 */}
        {/* 渲染頁面內容 */}
        <Component {...pageProps} />
        {/* 底部導覽欄 */}
        {showBottomNavigation && (
          <footer style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }}>
            <BottomNavigation value={value} onChange={handleNavigation}>
              <BottomNavigationAction
                label="探索"
                value="main-timeline"
                icon={<RestoreIcon />}
              />
              <BottomNavigationAction
                label="關注"
                value="feed-timeline"
                icon={<FavoriteIcon />}
              />
              <BottomNavigationAction
                label="貼文"
                value="myposts"
                icon={<AddCircleOutlineIcon />}
              />
              <BottomNavigationAction
                label="報名"
                value="my-enrolls"
                icon={<ShoppingCartIcon />}
              />
              <BottomNavigationAction
                label="個人"
                value="profile"
                icon={<AccountCircleIcon />}
              />
            </BottomNavigation>
          </footer>
        )}
      </div>
    </ThemeProvider>
  );
}

export default MyApp;
