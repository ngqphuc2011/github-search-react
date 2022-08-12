export interface IUser {
  username: string;
  id: string;
  avatar: string;
  followers: number;
  followings: number;
}

export interface IRepository {
  name: string;
  id: string;
  stars: number;
  forks: number;
}

export interface IRootState {
  likedUser: {
    users: Array<any>;
  };
}
