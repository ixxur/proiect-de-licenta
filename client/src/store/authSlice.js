import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const toggleFavoriteSpot = createAsyncThunk(
  "auth/toggleFavoriteSpot",
  async (spotId, { getState, dispatch }) => {
    console.log(spotId);
    const { username, favorites } = getState().auth.user;
    console.log(getState().auth.user);
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

export const fetchUserRatings = createAsyncThunk(
  "auth/fetchUserRatings",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/users/${username}/ratings`);
      console.log(response.data);
      return response.data;
      
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  user: {
    username: "",
    favorites: [],
    ratings: [],
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
      state.user.ratings = action.payload.ratings;
      console.log(action.payload.ratings);
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
      state.user.favorites.push(action.payload);
      // if (action.payload) {
      //   console.log(action.payload);

      //   console.log(state.user);
      // } else {
      //   console.error("Payload is not an array");
      // }
    },
    removeFavoriteSpot: (state, action) => {
      console.log(action.payload);
      const newFavorites = state.user.favorites.filter(
        (spotId) => spotId !== action.payload
      );
      console.log(newFavorites);
      state.user.favorites = newFavorites;
      console.log(state.user.favorites);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavoriteSpot.fulfilled, (state, action) => {})
      .addCase(fetchUserRatings.fulfilled, (state, action) => {
        state.user.ratings = action.payload;
      });
  },
});

export const { loginSuccess, logout, addFavoriteSpot, removeFavoriteSpot } =
  authSlice.actions;
// export { toggleFavoriteSpot };
export default authSlice.reducer;
