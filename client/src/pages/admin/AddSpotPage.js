import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Table,
  TableCell,
  TableRow,
  Snackbar,
  TableContainer,
  Paper,
  Typography,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { API_URL } from "../../constants/url";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: 45.9432,
  lng: 24.9668,
};

const AddSpotPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [whenToGo, setWhenToGo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState(center);
  const [notification, setNotification] = useState({
    message: "",
    open: false,
  });

  // const API_URL = process.env.REACT_APP_API_URL || "http://licenta2023backend.hopto.org" || "http://localhost:5000";

  const handleSubmit = (event) => {
    event.preventDefault();
    const spot = {
      name,
      latitude: location.lat,
      longitude: location.lng,
      description,
      whenToGo,
      imageUrl,
    };
    axios
      .post(`${API_URL}/spot`, spot)
      .then((response) => {
        // console.log(response.data);
        setNotification({ message: "Spot saved successfully", open: true });
      })
      .catch((error) => {
        console.error("Error adding spot", error);
        setNotification({ message: "Could not add spot", open: true });
      });
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setNotification({ ...notification, open: false });
  };

  return (
    <>
      <Navbar />
      <TableContainer component={Paper}>
        <form onSubmit={handleSubmit}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableRow>
              <TableCell align="center">
                <Typography fontWeight="bold">Titlu</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  name="name"
                  label="titlu"
                  fullWidth
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">
                <Typography fontWeight="bold">URL imagine</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  name="imageUrl"
                  label="url imagine"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                />
                <img
                  src={imageUrl}
                  alt={name}
                  style={{ maxWidth: "300px", maxHeight: "90px" }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">
                <Typography fontWeight="bold">Descriere</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  name="description"
                  label="descriere"
                  multiline
                  fullWidth
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">
                <Typography fontWeight="bold">Când să mergi</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  name="whenToGo"
                  label="perioadă"
                  multiline
                  fullWidth
                  value={whenToGo}
                  onChange={(event) => setWhenToGo(event.target.value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center">
                <Typography fontWeight="bold">Hartă</Typography>
              </TableCell>
              <TableCell>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={location}
                  zoom={7}
                  onClick={(e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    setLocation({ lat, lng });
                  }}
                >
                  {location && <Marker position={location} />}
                </GoogleMap>
              </TableCell>
            </TableRow>
          </Table>
          <Button fullWidth type="submit" variant="outlined" color="primary">
            Adaugă locație
          </Button>
        </form>
      </TableContainer>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        message={notification.message}
      />
    </>
  );
};

export default AddSpotPage;
