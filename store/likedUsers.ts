import { IUser } from './../types/index';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [] as any,
};

const likedUserSlice = createSlice({
  name: 'likedUser',
  initialState: initialState,
  reducers: {
    fetchLikedUser(state) {
      const likedUsers = localStorage.getItem('likedUsers');
      if (likedUsers) {
        state.users = [...JSON.parse(likedUsers)];
      }
    },
    likeUser(state, action) {
      const likedUser = action.payload;
      state.users.push(likedUser);
      localStorage.setItem('likedUsers', JSON.stringify(state.users));
    },
    unlikeUser(state, action) {
      const unlikedUserId = action.payload;
      state.users = state.users.filter(
        (item: IUser) => item.id !== unlikedUserId
      );
      localStorage.setItem('likedUsers', JSON.stringify(state.users));
    },
  },
});

export default likedUserSlice;
