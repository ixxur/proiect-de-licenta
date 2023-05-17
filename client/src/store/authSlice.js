import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const toggleFavoriteSpot = createAsyncThunk(
  "auth/toggleFavoriteSpot",
  async (spotId, { getState, dispatch }) => {
    const { username, favorites } = getState().auth.user;

    try {
      if (favorites.includes(spotId)) {
        await axios.delete(`/users/${username}/favorites`, {
          data: { spotId },
        });
        dispatch(authSlice.actions.removeFavoriteSpot(spotId));
      } else {
        await axios.post(`/users/${username}/favorites`, { spotId });
        dispatch(authSlice.actions.addFavoriteSpot(spotId));
      }
    } catch (error) {
      console.error(error);
    }
  }
);

const initialState = {
  user: {
    username: "",
    favorites: [],
  },
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      console.log(action.payload.user.username);
      state.user.username = action.payload.user.username;
      console.log(action.payload.user.username);
      state.user.favorites = action.payload.favorites;
      console.log(action.payload.favorites);
      console.log(action.payload);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user.username = "";
      state.user.favorites = [];
    },
    addFavoriteSpot: (state, action) => {
      console.log(state);
      console.log("======================");
      console.log(state.user);
      console.log(action.payload);
      state.user.favorites.push(...action.payload);
      // if (action.payload) {
      //   console.log(action.payload);
        
      //   console.log(state.user);
      // } else {
      //   console.error("Payload is not an array");
      // }
    },
    removeFavoriteSpot: (state, action) => {
      state.user.favorites = state.user.favorites.filter(
        (spotId) => spotId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleFavoriteSpot.fulfilled, (state, action) => {
      // No need to handle state update here because we've already
      // updated the state in the addFavoriteSpot and removeFavoriteSpot actions.
    });
  },
});

export const { loginSuccess, logout, addFavoriteSpot, removeFavoriteSpot } =
  authSlice.actions;
// export { toggleFavoriteSpot };
export default authSlice.reducer;
