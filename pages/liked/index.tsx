import styled from 'styled-components';
import { People } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import UserList from '../../components/UserList';
import { likedUserActions } from '../../store';
import { useEffect } from 'react';

const StyledInitialFavoritePage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 70%;
  padding: 8px 0;
`;
const StyledInitialIcon = styled(People)`
  font-size: 36px;
  color: #9e9e9e;
`;
const StyledInitialText = styled.span`
  text-align: center;
  max-width: 400px;
  color: #9e9e9e;
  padding: 8px 0;
`;
const StyledFavoritePage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
`;

const LikedPage: React.FC = () => {
  const dispatch = useDispatch();
  const likedUsersList = useSelector((state: any) => state.likedUser.users);

  useEffect(() => {
    dispatch(likedUserActions.fetchLikedUser());
  }, [dispatch]);
  const initialPage = (
    <StyledInitialFavoritePage>
      <StyledInitialIcon />
      <StyledInitialText>
        Once you like people, you&#39;ll see them here.
      </StyledInitialText>
    </StyledInitialFavoritePage>
  );
  const favoritePage = (
    <StyledFavoritePage>
      <UserList usersList={likedUsersList} />
    </StyledFavoritePage>
  );
  const mainPage = likedUsersList.length ? favoritePage : initialPage;
  return mainPage;
};

export default LikedPage;
