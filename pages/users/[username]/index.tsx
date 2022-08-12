import { Avatar, Box, CircularProgress, Tab } from '@mui/material';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Fragment, SyntheticEvent, useEffect, useState } from 'react';
import { Apartment } from '@mui/icons-material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import RepositoryList from '../../../components/RepositoryList';
import UserList from '../../../components/UserList';
import { formatNumber } from '../../../utils/format-number';

const StyledUserDataName = styled.div`
  font-family: 'Arsenal';
  font-weight: bold;
  font-size: 26px;
`;
const StyledUserDataUsername = styled.div`
  font-family: 'Arsenal';
  font-size: 24px;
`;
const StyledUserDataLocation = styled.div`
  display: flex;
  align-items: center;
`;
const StyledTabPanel = styled(TabPanel)`
  padding: 0;
`;
const StyledProgress = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`;

const UsersPage: React.FC = () => {
  const [repositoriesList, setRepositoriesList] = useState([] as any);
  const [followersList, setFollowersList] = useState([] as any);
  const [followingList, setFollowingList] = useState([] as any);
  const [userData, setUserData] = useState({
    avatar: '',
    username: '',
    name: '',
    location: '',
    followers: 0,
    following: 0,
    repositories: 0,
  });
  const [tabValue, setTabValue] = useState('1');
  const [repositoriesPage, setRepositoriesPage] = useState(1);
  const [followersPage, setFollowersPage] = useState(1);
  const [followingPage, setFollowingPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const tabValueChangeHandler = (event: SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  const changeRepositoryPageHandler = (value: number) => {
    setRepositoriesPage(value);
  };
  const changeFollowerPageHandler = (value: number) => {
    setFollowersPage(value);
  };
  const changeFollowingPageHandler = (value: number) => {
    setFollowingPage(value);
  };
  useEffect(() => {
    if (router.query.username) {
      const fetchUserData = async () => {
        const searchUrl = new URL(
          `https://api.github.com/users/${router.query.username}`
        );
        const response = await fetch(searchUrl, {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_TOKEN || '',
          },
        });
        const responseData = await response.json();
        const processedUserData = {
          avatar: responseData.avatar_url,
          username: responseData.login,
          name: responseData.name,
          location: responseData.location,
          followers: responseData.followers,
          following: responseData.following,
          repositories: responseData.public_repos,
        };
        setUserData(processedUserData);
      };
      fetchUserData();
    }
  }, [router.query.username]);

  useEffect(() => {
    const fetchUserRepos = async () => {
      setIsLoading(true);
      const searchUrl = new URL(
        `https://api.github.com/users/${router.query.username}/repos`
      );
      searchUrl.searchParams.append('page', `${repositoriesPage}`);
      searchUrl.searchParams.append('per_page', '12');
      const response = await fetch(searchUrl, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_TOKEN || '',
        },
      });
      const responseData = await response.json();
      const processedUserRepos = responseData.map((repo: any) => {
        return {
          id: repo.id,
          name: repo.name,
          forks: repo.forks_count,
          stars: repo.stargazers_count,
        };
      });
      setRepositoriesList(processedUserRepos);
    };
    fetchUserRepos().finally(() => {
      setIsLoading(false);
    });
  }, [repositoriesPage, router.query.username]);

  useEffect(() => {
    const fetchUserFollowers = async () => {
      setIsLoading(true);
      const searchUrl = new URL(
        `https://api.github.com/users/${router.query.username}/followers`
      );
      searchUrl.searchParams.append('page', `${followersPage}`);
      searchUrl.searchParams.append('per_page', '12');
      const response = await fetch(searchUrl, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_TOKEN || '',
        },
      });
      const responseData = await response.json();
      const promiseItems = responseData.map(async (item: any) => {
        const detailUrl = new URL(`https://api.github.com/users/${item.login}`);
        const detailResponse = await fetch(detailUrl, {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_TOKEN || '',
          },
        });
        const detailResponseData = await detailResponse.json();
        return {
          avatar: item.avatar_url,
          id: item.id,
          username: item.login,
          followers: detailResponseData.followers,
          following: detailResponseData.following,
        };
      });
      const processedUserFollowers = await Promise.all(promiseItems);
      setFollowersList(processedUserFollowers);
    };
    fetchUserFollowers().finally(() => {
      setIsLoading(false);
    });
  }, [followersPage, router.query.username]);

  useEffect(() => {
    const fetchUserFollowings = async () => {
      setIsLoading(true);
      const searchUrl = new URL(
        `https://api.github.com/users/${router.query.username}/following`
      );
      searchUrl.searchParams.append('page', `${followingPage}`);
      searchUrl.searchParams.append('per_page', '12');
      const response = await fetch(searchUrl, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_TOKEN || '',
        },
      });
      const responseData = await response.json();
      const promiseItems = responseData.map(async (item: any) => {
        const detailUrl = new URL(`https://api.github.com/users/${item.login}`);
        const detailResponse = await fetch(detailUrl, {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_TOKEN || '',
          },
        });
        const detailResponseData = await detailResponse.json();
        return {
          avatar: item.avatar_url,
          id: item.id,
          username: item.login,
          followers: detailResponseData.followers,
          following: detailResponseData.following,
        };
      });
      const processedUserFollowing = await Promise.all(promiseItems);
      setFollowingList(processedUserFollowing);
    };
    fetchUserFollowings().finally(() => {
      setIsLoading(false);
    });
  }, [followingPage, router.query.username]);
  return (
    <Fragment>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{ height: 160, width: 160 }}
          src={userData.avatar}
          alt={userData.username}
        />
        <StyledUserDataName>{userData.name}</StyledUserDataName>
        <StyledUserDataUsername>{userData.username}</StyledUserDataUsername>
        <StyledUserDataLocation>
          <Apartment sx={{ fontSize: 16, marginRight: '4px' }} />
          <span>{userData.location || 'Not Available'}</span>
        </StyledUserDataLocation>
      </Box>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList
              variant='fullWidth'
              onChange={tabValueChangeHandler}
              aria-label='lab API tabs example'
            >
              <Tab
                label={`Repositories (${formatNumber(userData.repositories)})`}
                value='1'
              />
              <Tab
                label={`Followers (${formatNumber(userData.followers)})`}
                value='2'
              />
              <Tab
                label={`Following (${formatNumber(userData.following)})`}
                value='3'
              />
            </TabList>
          </Box>
          <StyledTabPanel value='1'>
            {isLoading ? (
              <StyledProgress>
                <CircularProgress />
              </StyledProgress>
            ) : (
              <RepositoryList
                repositoriesList={repositoriesList}
                totalCount={userData.repositories}
                onChangePage={changeRepositoryPageHandler}
                currentPage={repositoriesPage}
              />
            )}
          </StyledTabPanel>
          <StyledTabPanel value='2'>
            {isLoading ? (
              <StyledProgress>
                <CircularProgress />
              </StyledProgress>
            ) : (
              <UserList
                usersList={followersList}
                totalCount={userData.followers}
                onChangePage={changeFollowerPageHandler}
                currentPage={followersPage}
              />
            )}
          </StyledTabPanel>
          <StyledTabPanel value='3'>
            {isLoading ? (
              <StyledProgress>
                <CircularProgress />
              </StyledProgress>
            ) : (
              <UserList
                usersList={followingList}
                totalCount={userData.following}
                onChangePage={changeFollowingPageHandler}
                currentPage={followingPage}
              />
            )}
          </StyledTabPanel>
        </TabContext>
      </Box>
    </Fragment>
  );
};

export default UsersPage;
