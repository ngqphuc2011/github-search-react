import { configureStore } from '@reduxjs/toolkit';
import likedUserSlice from './likedUsers';

const store = configureStore({
  reducer: {
    likedUser: likedUserSlice.reducer,
  },
});

export const likedUserActions = likedUserSlice.actions;
export default store;
