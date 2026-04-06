import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ShellState = {
  navOpen: boolean;
};

const initialState: ShellState = {
  navOpen: true,
};

const shellSlice = createSlice({
  name: 'shell',
  initialState,
  reducers: {
    setNavOpen(state, action: PayloadAction<boolean>) {
      state.navOpen = action.payload;
    },
  },
});

export const { setNavOpen } = shellSlice.actions;
export default shellSlice.reducer;
