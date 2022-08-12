import { CircularProgress, Grid, Pagination, TextField } from '@mui/material';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { GitHub, Search } from '@mui/icons-material';
import UserCard from '../components/UserCard';
import { IUser } from '../types';
import { useRouter } from 'next/router';
import { get } from '../utils/http-fetch';

const StyledInitialSearchPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 70%;
  padding: 8px 0;
`;
const StyledInitialIcon = styled(GitHub)`
  font-size: 128px;
  color: #9e9e9e;
`;
const StyledInitialText = styled.span`
  text-align: center;
  max-width: 400px;
  color: #9e9e9e;
  padding: 8px 0;
`;
const StyledSearchResultPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
`;
const StyledPagination = styled.div`
  min-height: 128px;
  margin: 16px auto;
`;
const StyledUsersNumberFound = styled.div`
  margin-bottom: 8px;
`;
const StyledNotFoundPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 70%;
  padding: 8px 0;
`;
const StyledNotFoundIcon = styled(Search)`
  font-size: 36px;
  color: #9e9e9e;
`;
const StyledNotFoundText = styled.span`
  text-align: center;
  max-width: 400px;
  color: #9e9e9e;
  padding: 8px 0;
`;
const StyledNotFoundUsername = styled.span`
  text-align: center;
  max-width: 400px;
  font-weight: bold;
`;
const StyledProgress = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`;

const Home: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [usersList, setUsersList] = useState([] as any);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async () => {
      if (searchText) {
        const searchUrl = new URL('https://api.github.com/search/users');
        searchUrl.searchParams.append('q', `${searchText} in:login`);
        searchUrl.searchParams.append('page', `${page}`);
        searchUrl.searchParams.append('per_page', '12');

        const response = await get(searchUrl);
        const responseData = await response.json();
        const processedTotalCount = responseData.total_count;
        setTotalCount(processedTotalCount);
        if (Array.isArray(responseData.items)) {
          const promiseItems = responseData.items.map(async (item: any) => {
            const detailUrl = new URL(
              `https://api.github.com/users/${item.login}`
            );
            const detailResponse = await get(detailUrl)
            const detailResponseData = await detailResponse.json();
            return {
              avatar: item.avatar_url,
              id: item.id,
              username: item.login,
              followers: detailResponseData.followers,
              following: detailResponseData.following,
            };
          });
          const processedItems = await Promise.all(promiseItems);
          setUsersList(processedItems || []);
        }
      }
    };
    const fetchUserHandler = setTimeout(async () => {
      await fetchUser().catch((error) => {
        setTotalCount(0);
        setUsersList([]);
      });
      setIsLoading(false);
    }, 300);
    return () => {
      clearTimeout(fetchUserHandler);
    };
  }, [searchText, page]);
  useEffect(() => {
    if (router.query.page) {
      setPage(+router.query.page);
    } else {
      setPage(1);
    }
  }, [router.query.page]);
  useEffect(() => {
    if (router.query.q) {
      setSearchText(router.query.q.toString());
    }
  }, [router.query.q]);

  const changeSearchTextHandler = (event: ChangeEvent<HTMLInputElement>) => {
    router.push({
      query: { q: event.target.value },
    });
    setSearchText(event.target.value);
  };
  const changePageHandler = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    router.push({
      query: { ...router.query, page: value },
    });
  };

  const initialPage = (
    <StyledInitialSearchPage>
      <StyledInitialIcon />
      <StyledInitialText>
        Enter GitHub username and search users matching the input like Google
        Search, click avatars to view more details, including repositories,
        followers and following
      </StyledInitialText>
    </StyledInitialSearchPage>
  );
  const searchResultPage = (
    <StyledSearchResultPage>
      <StyledUsersNumberFound>
        {totalCount} GitHub users found
      </StyledUsersNumberFound>
      <Grid container spacing={2}>
        {usersList.map((user: IUser) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={user.id}>
            <UserCard
              user={{
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                followers: user.followers,
                followings: user.followings,
              }}
              searchText={searchText}
            />
          </Grid>
        ))}
      </Grid>
      <StyledPagination>
        <Pagination
          size='small'
          shape='rounded'
          color='primary'
          count={Math.ceil(Math.min(totalCount, 1000) / 12)}
          page={page}
          onChange={changePageHandler}
        />
      </StyledPagination>
    </StyledSearchResultPage>
  );
  const notFoundPage = (
    <StyledNotFoundPage>
      <StyledNotFoundIcon />
      <StyledNotFoundText>No search result found for</StyledNotFoundText>
      <StyledNotFoundUsername>{searchText}</StyledNotFoundUsername>
    </StyledNotFoundPage>
  );
  const mainPage = searchText.length
    ? totalCount
      ? searchResultPage
      : notFoundPage
    : initialPage;
  return (
    <Fragment>
      <TextField
        id='search'
        variant='outlined'
        placeholder='Enter GitHub username, i.e. gaearon'
        fullWidth
        value={searchText}
        onChange={changeSearchTextHandler}
      />
      {isLoading ? (
        <StyledProgress>
          <CircularProgress />
        </StyledProgress>
      ) : (
        mainPage
      )}
    </Fragment>
  );
};

export default Home;
