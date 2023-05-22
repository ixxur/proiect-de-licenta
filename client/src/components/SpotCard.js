import React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";

const SpotCard = ({ spot }) => {
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
        <Typography variant="body2" color="text.secondary">
          {spot.description}
        </Typography>
        <Link to={`/spot/${spot._id}`}>See more details</Link>
      </CardContent>
    </Card>
  );
};

export default SpotCard;
