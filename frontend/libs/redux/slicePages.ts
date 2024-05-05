import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PageState = {
  showSideBar: boolean;
  showDetails: boolean;
  district: string | null;
};

const PageSlice = createSlice({
  name: 'page',
  initialState: {
    showSideBar: false,
    showDetails: false,
    district: null,
  } as PageState,
  reducers: {
    toggleSideBar(state) {
      return { ...state, showSideBar: !state.showSideBar };
    },
    setShowDetails(state, action: PayloadAction<{ showDetails: boolean, district: string | null }>) {
      return { ...state, showDetails: action.payload.showDetails, district: action.payload.district };
    },
  },
});

export const { toggleSideBar, setShowDetails } = PageSlice.actions;
export const pageReducer = PageSlice.reducer;
