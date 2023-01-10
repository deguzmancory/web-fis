import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MyProfile } from 'src/queries';
import { IRootState } from '../store';

export interface IAuthState {
  isAuthenticated?: boolean;
  user: MyProfile;
  isPasswordVerify: boolean;
  isWelcomeScreen: boolean;
}

const initialState: IAuthState = {
  isAuthenticated: null,
  user: null,
  isPasswordVerify: false,
  isWelcomeScreen: false,
};

const userSelector = (state: IRootState) => state.auth.user;

export const userNameSelector = createSelector(
  userSelector,
  (user) => `${user.firstName} ${user.lastName}`
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setPasswordVerify: (state, action: PayloadAction<boolean>) => {
      state.isPasswordVerify = action.payload;
    },
    setIsWelcomeScreen: (state, action: PayloadAction<boolean>) => {
      state.isWelcomeScreen = action.payload;
    },
    setUserName: (state, action: PayloadAction<MyProfile>) => {
      state.user = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAuthenticated, setUserName, setPasswordVerify, setIsWelcomeScreen } =
  authSlice.actions;

export const authState = authSlice.getInitialState();

export default authSlice.reducer;
