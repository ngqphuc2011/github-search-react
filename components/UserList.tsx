import { Grid, Pagination } from '@mui/material';
import { useState } from 'react';
import styled from 'styled-components';
import { IUser } from '../types';
import UserCard from './UserCard';

const StyledTabPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
`;
const StyledPagination = styled.div`
  min-height: 128px;
  margin: 16px auto;
`;

const UserList: React.FC<{
  usersList: IUser[];
  totalCount?: number;
  currentPage?: number;
  onChangePage?: Function;
}> = (props) => {
  const [page, setPage] = useState(props.currentPage || 1);
  const changePageHandler = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    if (props.onChangePage) {
      props.onChangePage(value);
    }
  };

  return (
    <StyledTabPage>
      <Grid container spacing={2}>
        {props.usersList.map((user: IUser) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={user.id}>
            <UserCard
              user={{
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                followers: user.followers,
                followings: user.followings,
              }}
            />
          </Grid>
        ))}
      </Grid>
      {props.totalCount && props.totalCount > 0 ? (
        <StyledPagination>
          <Pagination
            size='small'
            shape='rounded'
            color='primary'
            count={Math.ceil(Math.min(props.totalCount, 1000) / 12)}
            page={page}
            onChange={changePageHandler}
          />
        </StyledPagination>
      ) : null}
    </StyledTabPage>
  );
};

export default UserList;
