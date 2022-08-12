import {
  Switch,
  Tooltip,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import styled from 'styled-components';
import { Search, Favorite, Home } from '@mui/icons-material';
import {
  ChangeEvent,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const StyledBottomNavigationAction = styled(BottomNavigationAction)`
  max-width: none;
`;
const StyledContainer = styled.div`
  padding: 0 1.5rem;
  height: 100%;
`;
const StyledHeader = styled.header`
  padding: 1rem 0;
`;
const StyledActions = styled.div`
  display: flex;
  justify-content: space-between;
`;
const StyledPageName = styled.span`
  margin-top: auto;
  margin-bottom: auto;
  font-size: 20px;
  font-weight: 700;
  font-family: Arsenal;
`;
const StyledHomeButton = styled(Home)`
  cursor: pointer;
`;
const StyledMain = styled.main`
  height: 100%;
`;

const Layout: React.FC<{ children: ReactNode }> = (props) => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [bottomNavigationPage, setBottomNavigationPage] = useState(0);

  useEffect(() => {
    setDarkMode(localStorage.getItem('darkMode') === 'dark' ? true : false);
  }, []);
  const clickHomeHandler = () => {
    router.push('/');
  };
  const changeBottomNavigationPageHandler = (
    event: SyntheticEvent,
    newValue: number
  ) => {
    switch (newValue) {
      case 0:
        router.push('/');
        break;
      case 1:
        router.push('/liked');
        break;
    }
    setBottomNavigationPage(newValue);
  };
  const toggleDarkModeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked);
    localStorage.setItem('darkMode', event.target.checked ? 'dark' : 'light');
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });
  const pageName =
    router.pathname === '/' ? (
      <StyledPageName>Search</StyledPageName>
    ) : router.pathname === '/liked' ? (
      <StyledPageName>Favorite</StyledPageName>
    ) : (
      <StyledHomeButton onClick={clickHomeHandler} />
    );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>GitHub Search</title>
      </Head>
      <StyledContainer>
        <StyledHeader>
          <StyledActions>
            {pageName}
            <Tooltip title='Toggle dark mode' arrow>
              <Switch checked={darkMode} onChange={toggleDarkModeHandler} />
            </Tooltip>
          </StyledActions>
        </StyledHeader>
        <StyledMain>{props.children}</StyledMain>
        <footer>
          <Paper
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
            elevation={3}
          >
            <BottomNavigation
              showLabels
              value={bottomNavigationPage}
              onChange={changeBottomNavigationPageHandler}
            >
              <StyledBottomNavigationAction label='Search' icon={<Search />} />
              <StyledBottomNavigationAction
                label='Favorites'
                icon={<Favorite />}
              />
            </BottomNavigation>
          </Paper>
        </footer>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default Layout;
