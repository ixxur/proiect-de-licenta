import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../constants/url";

// const API_URL = window._env_.REACT_APP_API_URL || "http://licenta2023backend.hopto.org" || "http://localhost:5000";

export const toggleFavoriteSpot = createAsyncThunk(
  "auth/toggleFavoriteSpot",
  async (spotId, { getState, dispatch }) => {
    // console.log(spotId);
    
    const { username, favorites } = getState().auth.user;
    // console.log(getState().auth.user);
    try {
      if (favorites.includes(spotId)) {
        await axios.delete(`${API_URL}/users/${username}/favorites`, {
          data: { spotId },
        });
        dispatch(authSlice.actions.removeFavoriteSpot(spotId));
      } else {
        await axios.post(`${API_URL}/users/${username}/favorites`, { spotId });
        dispatch(authSlice.actions.addFavoriteSpot(spotId));
      }
    } catch (error) {
      console.error(error);
    }
  }
);

export const toggleVisitedSpot = createAsyncThunk(
  "auth/toggleVisitedSpot",
  async (spotId, { getState, dispatch }) => {
    // console.log(spotId);
    const { username, visited } = getState().auth.user;
    // console.log(getState().auth.user);
    try {
      if (visited.includes(spotId)) {
        await axios.delete(`${API_URL}/users/${username}/visited`, {
          data: { spotId },
        });
        dispatch(authSlice.actions.removeVisitedSpot(spotId));
      } else {
        await axios.post(`${API_URL}/users/${username}/visited`, { spotId });
        dispatch(authSlice.actions.addVisitedSpot(spotId));
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
      const response = await axios.get(`${API_URL}/users/${username}/ratings`);
      const ratings = response.data.map((rating) => ({
        spotId: rating.spotId,
        rating: rating.rating,
      }));
      //console.log(ratings);
      return ratings;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const postUserRating = createAsyncThunk(
  "auth/postUserRating",
  async ({ username, spotId, rating }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users/${username}/rating`, {
        spotId,
        rating,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateUserData = createAsyncThunk(
  "auth/updateUserData",
  async ({ username, name, profilePicture }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/users/${username}`, {
        name,
        profilePicture,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  user: {
    username: "",
    name: "",
    role: "",
    profilePicture: "",
    registrationDate: "",
    favorites: [],
    visited: [],
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
      state.user.username = action.payload.user.username;
      state.user.name = action.payload.name;
      state.user.role = action.payload.role;
      state.user.registrationDate = new Date(
        action.payload.registrationDate
      ).toLocaleDateString("en-GB");
      // console.log(state.user.name);
      // console.log(action.payload.user.username);
      state.user.profilePicture = action.payload.profilePicture;
      state.user.favorites = action.payload.favorites;
      state.user.visited = action.payload.visited;
      // console.log(state.user.registrationDate);
      // console.log(action.payload.favorites);
      state.user.ratings = action.payload.ratings;
      // console.log(action.payload.ratings);
      // console.log(action.payload);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user.username = "";
      state.user.name = "";
      state.user.role = "";
      state.user.profilePicture = "";
      state.user.registrationDate = "";
      state.user.favorites = [];
      state.user.visited = [];
      state.user.ratings = [];
    },
    addFavoriteSpot: (state, action) => {
      // console.log(state);
      // console.log("======================");
      // console.log(state.user);
      // console.log(action.payload);
      state.user.favorites.push(action.payload);
    },
    removeFavoriteSpot: (state, action) => {
      // console.log(action.payload);
      const newFavorites = state.user.favorites.filter(
        (spotId) => spotId !== action.payload
      );
      // console.log(newFavorites);
      state.user.favorites = newFavorites;
      // console.log(state.user.favorites);
    },
    addVisitedSpot: (state, action) => {
      // console.log(state);
      // console.log("======================");
      // console.log(state.user);
      // console.log(action.payload);
      state.user.visited.push(action.payload);
    },
    removeVisitedSpot: (state, action) => {
      // console.log(action.payload);
      const newVisited = state.user.visited.filter(
        (spotId) => spotId !== action.payload
      );
      // console.log(newVisited);
      state.user.visited = newVisited;
      // console.log(state.user.visited);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleFavoriteSpot.fulfilled, (state, action) => {})
      .addCase(toggleVisitedSpot.fulfilled, (state, action) => {})
      .addCase(fetchUserRatings.fulfilled, (state, action) => {
        state.user.ratings = action.payload;
      })
      .addCase(postUserRating.fulfilled, (state, action) => {
        const ratingObject = state.user.ratings.find(
          (rating) => rating.spotId === action.payload.spotId
        );
        if (ratingObject) {
          ratingObject.rating = action.payload.rating;
        } else {
          state.user.ratings.push(action.payload);
        }
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        // console.log(action.payload.user);
        // console.log(action.payload.user.profilePicture);
        // console.log(action.payload.profilePicture);
        state.user.name = action.payload.user.name;
        state.user.profilePicture = action.payload.user.profilePicture;
        // console.log(state.user);
      });
  },
});

export const { loginSuccess, logout, addFavoriteSpot, removeFavoriteSpot, addVisitedSpot, removeVisitedSpot } =
  authSlice.actions;
export default authSlice.reducer;
