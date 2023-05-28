import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { GoogleMap, Marker } from "@react-google-maps/api";
import classes from "./NewSpotModal.module.css";
import { API_URL } from "../constants/url";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: 45.9432,
  lng: 24.9668,
};

const NewSpotModal = () => {
  const [open, setOpen] = useState(false);
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
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
        //console.log(response.data);
        setNotification({ message: "Spot saved successfully", open: true });
      })
      .catch((error) => {
        console.error("Error adding spot", error);
        setNotification({ message: "Could not add spot", open: true });
      });
    handleClose();
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setNotification({ ...notification, open: false });
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Spot
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box className={classes["modal-content"]}>
          <h2>Add Spot</h2>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="When to go"
            value={whenToGo}
            onChange={(e) => setWhenToGo(e.target.value)}
          />
          <TextField
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          {/* <LocalizationProvider dateAdapter={AdapterDayjs}
            localeText={
              deDE.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DatePicker
              label={'"year"'}
              openTo="year"
              onChange={setWhenToGo}
              value={whenToGo}
            />
          </LocalizationProvider> */}
          {/* <DateTimePicker onChange={setWhenToGo} value={whenToGo} /> */}
          <div className={classes["map-container"]}>
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
          </div>
          <Button
            className={classes["save-button"]}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Save Spot
          </Button>
        </Box>
      </Modal>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        message={notification.message}
      />
    </div>
  );
}

export default NewSpotModal;
