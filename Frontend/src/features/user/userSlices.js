import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userDetails: null,
    token: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userDetails = action.payload.user;  
      state.token = action.payload.token;      
    },
    clearUser: (state) => {  
      state.userDetails = null;
      state.token = null;
    }
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
