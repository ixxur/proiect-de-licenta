import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { postUserRating } from "../store/authSlice";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";

const SpotCard = ({ spot }) => {
  // const dispatch = useDispatch();
  // const user = useSelector((state) => state.auth.user);

  // const userRatings = user.ratings || [];
  // const userRatingObject = userRatings.find(
  //   (rating) => rating.spotId === spot._id
  // );

  // const [userRating, setUserRating] = useState(
  //   userRatingObject ? userRatingObject.rating : null
  // );
  // const [averageRating, setAverageRating] = useState(spot.avgRating);

  // useEffect(() => {
  //     dispatch(fetchUserRatings(user.username));
  // }, [dispatch, user]);

  // useEffect(() => {
  //   const fetchSpot = async () => {
  //     try {
  //       const response = await axios.get(`/spots/${spot._id}`);
  //       // setAverageRating(response.data.avgRating);
  //     } catch (error) {
  //       console.error("Error fetching spot:", error);
  //     }
  //   };

  //   fetchSpot();
  // }, [spot._id]);

  // const handleRatingChange = async (event, newValue) => {
  //   setUserRating(newValue);

  //   // Send the new rating to the server
  //   try {
  //     const response = await axios.post(`/users/${user.username}/rating`, {
  //       spotId: spot._id,
  //       rating: newValue,
  //     });
  //     // //  console.log("handleRatingChange - spotId: " + spot._id);
  //     // //   const response = await axios.post(`/spots/${spot._id}/rating`, {
  //     // //     rating: newValue,
  //     // //   });
  //     // const response = await axios.get(`/spots/${spot._id}`);
  //     // console.log(response);
  //     // setAverageRating(response.data.avgRating);
  //     console.log(response);
  //     setAverageRating(response.data.avgRating);
  //     dispatch(
  //       postUserRating({
  //         username: user.username,
  //         spotId: spot._id,
  //         rating: newValue,
  //       })
  //     );
  //   } catch (error) {
  //     console.log("Error updating rating:", error);
  //   }
  // };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={spot.imageUrl}
        alt={spot.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {spot.name}
        </Typography>
        <Rating
          name="read-only"
          value={spot.avgRating}
          precision={0.5}
          readOnly
          // onChange={handleRatingChange}
        />
        <Typography variant="subtitle1">Rating: {spot.avgRating}</Typography>
        <Typography variant="body2" color="text.secondary">
          {spot.description}
        </Typography>
        <Link to={`/spot/${spot._id}`}>See more details</Link>
      </CardContent>
    </Card>
  );
};

export default SpotCard;
