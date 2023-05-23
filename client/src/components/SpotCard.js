import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  IconButton,
} from "@mui/material";
import {
  FavoriteBorder,
  Favorite,
  WhereToVoteOutlined,
  WhereToVote,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavoriteSpot, toggleVisitedSpot } from "../store/authSlice";

const SpotCard = ({ spot }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const isFav = user.favorites.includes(spot._id);
  const isVisited = user.visited.includes(spot._id);

  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteSpot(spot._id));
  };

  const handleToggleVisited = () => {
    dispatch(toggleVisitedSpot(spot._id));
  };
  // const handleFavoriteClick = () => {
  //   if (isFav) {
  //     dispatch(removeFavoriteSpot(spot._id));
  //   } else {
  //     dispatch(addFavoriteSpot(spot._id));
  //   }
  // };

  // const handleVisitedClick = () => {
  //   if (isVisited) {
  //     dispatch(removeVisitedSpot(spot._id));
  //   } else {
  //     dispatch(addVisitedSpot(spot._id));
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
        />
        <Typography variant="subtitle1">Rating: {spot.avgRating}</Typography>
        <IconButton onClick={handleToggleFavorite}>
          {isFav ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <IconButton onClick={handleToggleVisited}>
          {isVisited ? <WhereToVote /> : <WhereToVoteOutlined />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {spot.description.length > 170
            ? spot.description.slice(0, 170) + "..."
            : spot.description}
        </Typography>
        <Link to={`/spot/${spot._id}`}>See more details</Link>
      </CardContent>
    </Card>
  );
};

export default SpotCard;
