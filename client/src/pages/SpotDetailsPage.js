import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import { Rating, Grid, Container, IconButton, Box } from "@mui/material";
import { postUserRating } from "../store/authSlice";
import Navbar from "../components/Navbar";
import {
  FavoriteBorder,
  Favorite,
  WhereToVoteOutlined,
  WhereToVote,
} from "@mui/icons-material";
import { toggleFavoriteSpot, toggleVisitedSpot } from "../store/authSlice";
import Loading from "../components/Loading";
import { API_URL } from "../constants/url";

// const API_URL = window._env_.REACT_APP_API_URL || "http://licenta2023backend.hopto.org" || "http://localhost:5000";

const SpotDetailsPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [weatherData, setWeatherData] = useState([]);

  const userRatings = user.ratings || [];
  const userRatingObject = userRatings.find((rating) => rating.spotId === id);

  const [userRating, setUserRating] = useState(
    userRatingObject ? userRatingObject.rating : null
  );

  const isFav = user.favorites.includes(id);
  const isVisited = user.visited.includes(id);

  useEffect(() => {
    const fetchSpotandWeather = async () => {
      try {
        const response = await axios.get(`${API_URL}/spots/${id}`);
        setSpot(response.data);
        setAverageRating(response.data.avgRating);
      } catch (err) {
        console.log(err);
      }

      try {
        const weatherRes = await axios.get(`${API_URL}/spots/${id}/weather`);
        // extract only the first 5 days from the daily forecast
        const fiveDaysWeather = weatherRes.data.daily
          .slice(0, 5)
          .map((day) => ({
            date: new Date(day.dt * 1000).toLocaleDateString("en-GB"), // Convert UNIX timestamp to readable date
            minTemp: day.temp.min - 273.15, // Convert to Celsius
            maxTemp: day.temp.max - 273.15, // Convert to Celsius
            icon: day.weather[0].icon,
            description: day.weather[0].description,
          }));
        setWeatherData(fiveDaysWeather);
      } catch (weatherError) {
        console.error(weatherError);
      }
    };

    fetchSpotandWeather();
  }, [id, userRating]);

  if (!spot) return <Loading />;

  const { name, description, whenToGo, imageUrl } = spot;

  const handleRatingChange = async (event, newValue) => {
    setUserRating(newValue);

    // Send the new rating to the server
    try {
      const response = await axios.post(
        `${API_URL}/users/${user.username}/rating`,
        {
          spotId: spot._id,
          rating: newValue,
        }
      );
      console.log(response);
      setAverageRating(response.data.avgRating);
      dispatch(
        postUserRating({
          username: user.username,
          spotId: spot._id,
          rating: newValue,
        })
      );
    } catch (error) {
      console.log("Error updating rating:", error);
    }
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteSpot(spot._id));
  };

  const handleToggleVisited = () => {
    dispatch(toggleVisitedSpot(spot._id));
  };

  return (
    <>
      <Navbar />
      <Container>
        <Box sx={{ flexGrow: 1, marginTop: 2, marginBottom: 2 }}>
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={imageUrl}
                alt={name}
                style={{ width: "90%", height: "auto" }}
              />
            </Grid>
            <Grid item xs={12}>
              <h1>{name}</h1>
            </Grid>
            <Grid item xs={12}>
              <Rating
                name="user-rating"
                value={userRating}
                precision={0.5}
                onChange={handleRatingChange}
              />
              <p>Rating: {averageRating}</p>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <IconButton onClick={handleToggleFavorite}>
                  {isFav ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <IconButton onClick={handleToggleVisited}>
                  {isVisited ? <WhereToVote /> : <WhereToVoteOutlined />}
                </IconButton>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <p style={{ whiteSpace: "pre-wrap" }}>{description}</p>
            </Grid>
            <Grid item xs={12}>
              <h3>Perioada cea mai buna de vizitat: </h3>
              <p>{whenToGo}</p>
            </Grid>
            <Grid item xs={12}>
              <h3>Vremea in {spot.name} pentru urmatoarele 5 zile: </h3>
              <Grid container spacing={2}>
                {weatherData.map((day, index) => (
                  <Grid item xs={12} sm={4} md={2} key={index}>
                    <p> {day.date}</p>
                    <p>Min Temp: {day.minTemp.toFixed(2)}°C</p>
                    <p>Max Temp: {day.maxTemp.toFixed(2)}°C</p>
                    <img
                      src={`http://openweathermap.org/img/w/${day.icon}.png`}
                      alt="Weather icon"
                      style={{ width: "70px", height: "70px" }}
                    />
                    <p>{day.description}</p>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Comments spotId={id} username={user.username} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default SpotDetailsPage;
