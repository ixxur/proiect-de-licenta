import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, DirectionsRenderer  } from "@react-google-maps/api";
import { google } from "window-or-global";
import axios from "axios";
import DetailsModal from "./DetailsModal";
import blueMarker from "../assets/pictures/blue-marker.png";
import redMarker from "../assets/pictures/red-marker.png";
import orangeMarker from "../assets/pictures/orange-marker.png";
import { useSelector } from "react-redux";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import { API_URL } from "../constants/url";

const containerStyle = {
  width: "100%",
  height: "800px",
};

const center = {
  lat: 45.9432,
  lng: 24.9668,
};

const Map = () => {
  const { favorites, visited } = useSelector(
    (state) => state.auth.user
  );
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [checkedSpots, setCheckedSpots] = useState([]);

  // const API_URL = process.env.REACT_APP_API_URL || "http://licenta2023backend.hopto.org" || "http://localhost:5000";

  useEffect(() => {
    const getAllSpots = async () => {
      try {
        const response = await axios.get(`${API_URL}/spots`);
        // const favoritesResponse = await axios.get(`/users/${username}/favorites`);
        // // const userResponse = await axios.get(`/users/${username}/`);
        // // console.log(userResponse.data);
        setSpots(response.data);

        // setFavorites(userResponse.data.favorites);
      } catch (err) {
        console.log("Error fetching spots ", err);
      }
    };
    getAllSpots();
  }, [favorites, visited]);

  const handleClick = (spot) => {
    setSelectedSpot(spot);
    setDetailsModalOpen(true);
  };

  const handleClose = () => {
    setSelectedSpot(null);
    setDetailsModalOpen(false);
  };

  const handleCheckboxChange = (spot) => {
    if (checkedSpots.includes(spot)) {
      setCheckedSpots(checkedSpots.filter((s) => s._id !== spot._id));
    } else {
      setCheckedSpots([...checkedSpots, spot]);
    }
  };

  const generateRoute = () => {
    if (checkedSpots.length >= 2) {
      // Generate route
      const waypoints = checkedSpots.slice(1, -1).map((spot) => ({
        location: { lat: spot.latitude, lng: spot.longitude },
        stopover: true,
      }));

      const origin = checkedSpots[0];
      const destination = checkedSpots[checkedSpots.length - 1];

      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: origin.latitude, lng: origin.longitude },
          destination: { lat: destination.latitude, lng: destination.longitude },
          waypoints: waypoints,
          travelMode: 'DRIVING',
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7.8}
        >
          {spots.map((spot) => (
            <Marker
              key={spot._id}
              position={{ lat: spot.latitude, lng: spot.longitude }}
              onClick={() => handleClick(spot)}
              icon={{
                url: visited.includes(spot._id)
                  ? orangeMarker
                  : favorites.includes(spot._id)
                  ? redMarker
                  : blueMarker,
                scaledSize: new google.maps.Size(65, 50),
              }}
            />
          ))}
          {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        </GoogleMap>
        <DetailsModal
          spot={selectedSpot}
          open={detailsModalOpen}
          onClose={handleClose}
        />
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Spot Name</TableCell>
                <TableCell>Latitude</TableCell>
                <TableCell>Longitude</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {spots.map((spot) => (
                <TableRow key={spot._id}>
                  <TableCell>
                    <Checkbox
                      checked={checkedSpots.includes(spot)}
                      onChange={() => handleCheckboxChange(spot)}
                    />
                  </TableCell>
                  <TableCell>{spot.name}</TableCell>
                  <TableCell>{spot.latitude}</TableCell>
                  <TableCell>{spot.longitude}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button onClick={generateRoute} disabled={checkedSpots.length < 2}>
          Generate Route
        </Button>
      </Grid>
    </Grid>
  );
};

export default Map;
