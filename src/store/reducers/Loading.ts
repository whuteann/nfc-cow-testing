import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

const initialState = {
	status: false
};

const LoadingSlice = createSlice({
  name: "Loading",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.status = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

const { actions, reducer } = LoadingSlice;

export const {
  setLoading, reset 
} = actions;

export const loadingSelector = (state: RootState) => state.loading;

export default reducer;