import { createSlice } from '@reduxjs/toolkit';

type PageState = {
  showSideBar: boolean;
};

const PageSlice = createSlice({
  name: 'page',
  initialState: {
    showSideBar: false,
  } as PageState,
  reducers: {
    toggleSideBar(state) {
      return { ...state, showSideBar: !state.showSideBar };
    },
  },
});

export const { toggleSideBar } = PageSlice.actions;
export const pageReducer = PageSlice.reducer;
