import {RootState} from '../../../store/index';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthResponse} from '../../../types/index';

export const initialState: any = {
  isBioMetricEnabled: false,
  loggedIn: false,
};

export const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    isEnableBioMetric: (state, action: PayloadAction<AuthResponse>) => {
      console.log('payload in slice', action.payload);
      state.isBioMetricEnabled = true;
    },
    isDisableBioMetric: (state, action: PayloadAction<AuthResponse>) => {
      console.log('payload in slice', action.payload);
      state.isBioMetricEnabled = false;
    },

    logout: state => {
      // state.userRequestPayload = undefined;
    },
  },
});

export const {isDisableBioMetric, logout, isEnableBioMetric} =
  AuthSlice.actions;

export const selectUserInfo = (state: RootState) => state.auth;

export default AuthSlice.reducer;
