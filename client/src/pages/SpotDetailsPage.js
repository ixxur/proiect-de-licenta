import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Comments from "../components/Comments";
import { useDispatch, useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import { postUserRating } from "../store/authSlice";

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

  useEffect(() => {
    const fetchSpotandWeather = async () => {
      try {
        const response = await axios.get(`/spots/${id}`);
        setSpot(response.data);
        setAverageRating(response.data.avgRating);
      } catch (err) {
        console.log(err);
      }

      try {
        const weatherRes = await axios.get(`/spots/${id}/weather`);
        // extract only the first 5 days from the daily forecast
        const fiveDaysWeather = weatherRes.data.daily
          .slice(0, 5)
          .map((day) => ({
            date: new Date(day.dt * 1000).toLocaleDateString("en-GB"), // Convert UNIX timestamp to readable date
            minTemp: day.temp.min - 273.15, // Convert to Celsius
            maxTemp: day.temp.max - 273.15, // Convert to Celsius
            icon: day.weather[0].icon,
          }));
        setWeatherData(fiveDaysWeather);
      } catch (weatherError) {
        console.error(weatherError);
      }
    };

    fetchSpotandWeather();
  }, [id, userRating]);

  if (!spot) return <div>Loading...</div>;

  const { name, description, whenToGo, imageUrl } = spot;

  const handleRatingChange = async (event, newValue) => {
    setUserRating(newValue);

    // Send the new rating to the server
    try {
      const response = await axios.post(`/users/${user.username}/rating`, {
        spotId: spot._id,
        rating: newValue,
      });
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

  return (
    <>
      <div>
        <h1>{name}</h1>
        <img src={imageUrl} alt={name} />
        <Rating
          name="user-rating"
          value={userRating}
          precision={0.5}
          onChange={handleRatingChange}
        />
        <p>Rating: {averageRating}</p>
        <p>{description}</p>
        <p>Best time to visit: {whenToGo}</p>
        <h3>Vremea in {spot.name} pentru urmatoarele 5 zile: </h3>
        {weatherData.map((day, index) => (
          <div key={index}>
            <p> {day.date}</p>
            <p>Min Temp: {day.minTemp.toFixed(2)}°C</p>
            <p>Max Temp: {day.maxTemp.toFixed(2)}°C</p>
            <img
              src={`http://openweathermap.org/img/w/${day.icon}.png`}
              alt="Weather icon"
              style={{ width: "70px", height: "70px" }}
            />
          </div>
        ))}
      </div>
      <div>
        <Comments spotId={id} username={user.username} />
      </div>
    </>
  );
};

export default SpotDetailsPage;
