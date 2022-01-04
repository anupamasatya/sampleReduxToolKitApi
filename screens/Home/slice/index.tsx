import {RootState} from './../../../redux/store/index';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserResponseError, DataResponse} from '../../../redux/types/index';

export const initialState: any = {
  isLoading: false,
  DataResponse: undefined,
  userResponseError: undefined,
  RequestPayload: undefined,
};

export const userDataSlice = createSlice({
  name: 'UserData',
  initialState,
  reducers: {
    userDataReq: state => {
      //state.RequestPayload = action.payload;
      state.isLoading = true;
    },
    userSuccess: (state, action: PayloadAction<DataResponse>) => {
      console.log('payload in slice', action.payload);
      state.DataResponse = action.payload;
      state.isLoading = false;
    },
    userError: (state, action: PayloadAction<UserResponseError>) => {
      state.userResponseError = action.payload;
      state.isLoading = false;
    },
    logout: state => {
      state.userRequestPayload = undefined;
    },
  },
});

export const {userDataReq, logout, userSuccess, userError} =
  userDataSlice.actions;

export const selectUserInfo = (state: RootState) => state.home;

export default userDataSlice.reducer;
