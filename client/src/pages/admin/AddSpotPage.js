import React, { useState } from "react";
import axios from "axios";
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
        console.log(response.data);
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
      <div>
        <form onSubmit={handleSubmit}>
          <Table>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>
                <TextField
                  name="name"
                  fullWidth
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Image URL</TableCell>
              <TableCell>
                <TextField
                  name="imageUrl"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                />
                <img src={imageUrl} alt={name} style={{ maxWidth: "300px" }} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>
                <TextField
                  name="description"
                  multiline
                  fullWidth
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>When to go</TableCell>
              <TableCell>
                <TextField
                  name="whenToGo"
                  multiline
                  fullWidth
                  value={whenToGo}
                  onChange={(event) => setWhenToGo(event.target.value)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Map</TableCell>
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
            Add Spot
          </Button>
        </form>
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleNotificationClose}
          message={notification.message}
        />
      </div>
    </>
  );
};

export default AddSpotPage;
