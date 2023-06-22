import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import {
  TextField,
  Button,
  Table,
  TableCell,
  TableRow,
  Snackbar,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Comments from "../../components/Comments";
import Loading from "../../components/Loading";
import { API_URL } from "../../constants/url";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const SpotDetailsEditPage = () => {
  const { id } = useParams();
  const { username } = useSelector((state) => state.auth.user);
  const [spot, setSpot] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    latitude: 0,
    longitude: 0,
    description: "",
    whenToGo: "",
    imageUrl: "",
  });
  const [location, setLocation] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    const fetchSpotandWeather = async () => {
      try {
        const response = await axios.get(`${API_URL}/spots/${id}`);
        setSpot(response.data);
        setAverageRating(response.data.avgRating);
        setFormData({
          name: response.data.name,
          latitude: response.data.latitude,
          longitude: response.data.longitude,
          description: response.data.description,
          whenToGo: response.data.whenToGo,
          imageUrl: response.data.imageUrl,
        });
        setLocation({
          lat: response.data.latitude,
          lng: response.data.longitude,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchSpotandWeather();
  }, [id]);

  if (!spot) return <Loading />;

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Send a PUT request to the server with the new data
    try {
      const response = await axios.put(`${API_URL}/spots/${id}`, formData);
      console.log(response);
      setNotification({ open: true, message: "Spot updated successfully" });
    } catch (error) {
      console.log("Error updating spot:", error);
      setNotification({ open: true, message: "Could not update spot" });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <Navbar />
      <div>
        <form onSubmit={handleSubmit}>
          <Table>
            <TableRow>
              <TableCell>Titlu</TableCell>
              <TableCell>
                <TextField
                  name="name"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>URL imagine</TableCell>
              <TableCell>
                <TextField
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
                <img
                  src={formData.imageUrl}
                  alt={formData.name}
                  style={{ maxWidth: "300px" }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Descriere</TableCell>
              <TableCell>
                <TextField
                  name="description"
                  multiline
                  fullWidth
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Când să mergi</TableCell>
              <TableCell>
                <TextField
                  name="whenToGo"
                  multiline
                  fullWidth
                  value={formData.whenToGo}
                  onChange={handleInputChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rating</TableCell>
              <TableCell>
                <Rating
                  name="read-only"
                  value={averageRating}
                  precision={0.5}
                  readOnly
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hartă</TableCell>
              <TableCell>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={location}
                  zoom={7}
                  onClick={(e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    setLocation({ lat, lng });
                    setFormData({ ...formData, latitude: lat, longitude: lng });
                  }}
                >
                  {location && <Marker position={location} />}
                </GoogleMap>
              </TableCell>
            </TableRow>
          </Table>
          <Button fullWidth type="submit" variant="outlined" color="primary">
            Actualizează
          </Button>
        </form>
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={notification.message}
        />
        <Comments spotId={id} username={username} />
      </div>
    </>
  );
};

export default SpotDetailsEditPage;
