import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Card, Box, Avatar } from '@mui/material';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { Fragment, SyntheticEvent } from 'react';
import { IRootState, IUser } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { likedUserActions } from '../store';
import { formatNumber } from '../utils/format-number';

const StyledPrimaryText = styled.div`
  margin-bottom: 8px;
`;
const StyledEllipsisText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const StyledHighlightedText = styled.span`
  font-weight: bold;
`;
const StyledSecondaryText = styled.div`
  font-size: 12px;
`;
const UserCard: React.FC<{ user: IUser; searchText?: string }> = (props) => {
  const router = useRouter();
  const likedUsers = useSelector((state: IRootState) => state.likedUser.users);
  const dispatch = useDispatch();

  const clickCardHandler = () => {
    router.push(`/users/${props.user.username}`);
  };
  const clickLikeHandler = (event: SyntheticEvent) => {
    event.stopPropagation();
    const likedUser = {
      avatar: props.user.avatar,
      followers: props.user.followers,
      followings: props.user.followings,
      id: props.user.id,
      username: props.user.username,
    };
    dispatch(likedUserActions.likeUser(likedUser));
  };
  const clickUnlikeHandler = (event: SyntheticEvent) => {
    event.stopPropagation();
    dispatch(likedUserActions.unlikeUser(props.user.id));
  };
  const checkIfLikedUser = () => {
    return likedUsers.find((user: IUser) => user.id === props.user.id);
  };
  const processedUsername = props.searchText ? (
    <Fragment>
      <StyledHighlightedText>{props.searchText.toLowerCase()}</StyledHighlightedText>
      {props.user.username.split(props.searchText.toLowerCase())}
    </Fragment>
  ) : (
    props.user.username
  );

  return (
    <Card
      sx={{
        display: 'flex',
        cursor: 'pointer',
        borderRadius: '10px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
      }}
      onClick={clickCardHandler}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px',
        }}
      >
        <Avatar
          sx={{ height: 64, width: 64, borderRadius: '10px' }}
          variant='square'
          src={props.user.avatar}
          alt={props.user.username}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '8px',
          width: '50%',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        <StyledPrimaryText>
          <StyledEllipsisText>{processedUsername}</StyledEllipsisText>
        </StyledPrimaryText>
        <div>
          <StyledSecondaryText>
            {formatNumber(props.user.followings)} followings
          </StyledSecondaryText>
          <StyledSecondaryText>
            {formatNumber(props.user.followers)} followers
          </StyledSecondaryText>
        </div>
      </Box>
      <Box sx={{ padding: '8px' }}>
        {checkIfLikedUser() ? (
          <Favorite
            sx={{ fontSize: 16 }}
            color='error'
            onClick={clickUnlikeHandler}
          />
        ) : (
          <FavoriteBorder
            sx={{ fontSize: 16 }}
            color='error'
            onClick={clickLikeHandler}
          />
        )}
      </Box>
    </Card>
  );
};

export default UserCard;
