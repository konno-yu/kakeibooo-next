import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Tabs = 'home' | 'householdbook' | 'utility-cost' | 'fridge' | 'settings';
interface AppSlice {
  selectedTab: Tabs;
}

const initialState: AppSlice = {
  selectedTab: 'home',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    selectTab: (state: AppSlice, action: PayloadAction<Tabs>) => {
      state.selectedTab = action.payload;
    },
  },
});

export const appReducer = appSlice.reducer;
export const appAction = appSlice.actions;
