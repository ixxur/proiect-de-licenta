import React from 'react';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import {
  FavoriteBorder,
  Favorite,
  WhereToVoteOutlined,
  WhereToVote,
} from "@mui/icons-material";
import { toggleFavoriteSpot, toggleVisitedSpot } from "../store/authSlice";
import classes from "./DetailsModal.module.css";
import { useDispatch, useSelector } from "react-redux";

const DetailsModal = ({ spot, open, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const favorites = user ? user.favorites : [];
  const visited = user ? user.visited : [];

  if (!spot) return null;

  const { name, whenToGo, imageUrl, _id } = spot;

  const isFavorite = favorites ? favorites.includes(_id) : false;
  const isVisited = visited ? visited.includes(_id) : false;

  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteSpot(_id));
  };

  const handleToggleVisited = () => {
    dispatch(toggleVisitedSpot(_id));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={classes.modalContent}>
        <Typography className={classes.title} variant="h4">
          {name}
        </Typography>
        <IconButton onClick={handleToggleFavorite}>
          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <IconButton onClick={handleToggleVisited}>
          {isVisited ? <WhereToVote /> : <WhereToVoteOutlined />}
        </IconButton>
        <img className={classes.image} src={imageUrl} alt={name} />
        <Typography className={classes.timeToVisit}>
          Best time to visit: {whenToGo}
        </Typography>
        <Link to={`/spot/${_id}`}>See more details</Link>
      </Box>
    </Modal>
  );
};

export default DetailsModal;
