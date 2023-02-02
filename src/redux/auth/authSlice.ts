import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MyProfile } from 'src/queries';
import { IRootState } from '../store';

export interface IAuthState {
  isAuthenticated?: boolean;
  user: MyProfile;
  isPasswordVerify: boolean;
  isWelcomeScreen: boolean;
  isUpdatedCurrentRole: boolean;
}

const initialState: IAuthState = {
  isAuthenticated: null,
  user: null,
  isPasswordVerify: false,
  isWelcomeScreen: false,
  isUpdatedCurrentRole: false,
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
    setIsUpdatedCurrentRole: (state, action: PayloadAction<boolean>) => {
      state.isUpdatedCurrentRole = action.payload;
    },
    setProfile: (state, action: PayloadAction<MyProfile>) => {
      state.user = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAuthenticated,
  setProfile,
  setPasswordVerify,
  setIsWelcomeScreen,
  setIsUpdatedCurrentRole,
} = authSlice.actions;

export const authState = authSlice.getInitialState();

export default authSlice.reducer;
