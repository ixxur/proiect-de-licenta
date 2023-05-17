import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import classes from "./DetailsModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavoriteSpot } from "../store/authSlice";

const DetailsModal = ({ spot, open, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const favorites = user ? user.favorites : [];

  if (!spot) return null;

  const { name, description, whenToGo, imageUrl, _id } = spot;

  const isFavorite = favorites ? favorites.includes(_id) : false;

  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteSpot(_id));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={classes.modalContent}>
        <Typography className={classes.title} variant="h4">
          {name}
        </Typography>
        <button onClick={handleToggleFavorite}>
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </button>
        <img className={classes.image} src={imageUrl} alt={name} />
        <Typography className={classes.description}>{description}</Typography>
        <Typography className={classes.timeToVisit}>
          Best time to visit: {whenToGo}
        </Typography>

        <Link to={`/spot/${_id}`}>See more details</Link>
      </Box>
    </Modal>
  );
};

export default DetailsModal;
