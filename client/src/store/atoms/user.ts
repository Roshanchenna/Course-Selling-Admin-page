import {atom} from "recoil";


type UserState = {
  userEmail: string | null;
  isLoading: boolean;
};

export const userState = atom<UserState>({
  key: 'userState',
  default: {
    isLoading: true,
    userEmail: null
  },
});
