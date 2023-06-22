import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import { google } from "window-or-global";
import axios from "axios";
import DetailsModal from "./DetailsModal";
import blueMarker from "../assets/pictures/blue-marker.png";
import redMarker from "../assets/pictures/red-marker.png";
import orangeMarker from "../assets/pictures/orange-marker.png";
import blackMarker from "../assets/pictures/black-marker.png";
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
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
  const { favorites, visited } = useSelector((state) => state.auth.user);
  const [spots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [checkedSpots, setCheckedSpots] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);

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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log(location);
          setCurrentLocation(location);
        },
        function (error) {
          console.log("Geolocation error: ", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

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
    if (
      checkedSpots.length >= 1 &&
      currentLocation &&
      typeof currentLocation.lat === "number" &&
      typeof currentLocation.lng === "number"
    ) {
      // Generate route
      let waypoints;
      let destination;

      if (checkedSpots.length === 1) {
        // If there is only one spot in checkedSpots, use it as the destination
        destination = {
          lat: checkedSpots[0].latitude,
          lng: checkedSpots[0].longitude,
        };
      } else {
        // If there is more than one spot in checkedSpots, use all but the last one as waypoints
        waypoints = checkedSpots.slice(0, -1).map((spot) => ({
          location: { lat: spot.latitude, lng: spot.longitude },
          stopover: true,
        }));

        // And use the last one as the destination
        destination = {
          lat: checkedSpots[checkedSpots.length - 1].latitude,
          lng: checkedSpots[checkedSpots.length - 1].longitude,
        };
      }

      const origin = currentLocation;

      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: origin.lat, lng: origin.lng },
          destination: destination,
          waypoints: waypoints,
          travelMode: "DRIVING",
          region: "ro",
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            let totalDistance = 0;
            let totalDuration = 0;

            const route = result.routes[0];
            for (let i = 0; i < route.legs.length; i++) {
              totalDistance += route.legs[i].distance.value;
              totalDuration += route.legs[i].duration.value;
            }

            let hours = Math.floor(totalDuration / 3600);
            let minutes = Math.floor((totalDuration % 3600) / 60);
            let distance = (totalDistance / 1000).toFixed(1);

            const contentString = `
  <div>
    <h2>Detalii rută</h2>
    <p>Distanță: ${distance} km</p>
    <p>Durată: ${hours} ore și ${minutes} minute</p>
  </div>
`;

            setRouteDetails({
              distance: distance,
              duration: { hours, minutes },
              steps: route.legs[0].steps, // This is the array of instructions
            });

            setInfoWindow({
              content: contentString,
              position: result.routes[0].legs[0].end_location, // The position for the InfoWindow
            });
            setDirectionsResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  };

  const resetRoute = () => {
    setCheckedSpots([]);
    setDirectionsResponse(null);
    setRouteDetails(null);
    setInfoWindow(null);
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
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {currentLocation && (
            <Marker
              position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
              icon={{
                url: blackMarker,
                scaledSize: new google.maps.Size(65, 50),
              }}
            />
          )}
          {infoWindow && (
            <InfoWindow
              position={infoWindow.position}
              onCloseClick={() => setInfoWindow(null)}
            >
              <div
                dangerouslySetInnerHTML={{ __html: infoWindow.content }}
              ></div>
            </InfoWindow>
          )}
        </GoogleMap>
        <DetailsModal
          spot={selectedSpot}
          open={detailsModalOpen}
          onClose={handleClose}
        />
        {routeDetails && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Detalierea rutei</Typography>
            </AccordionSummary>
            {routeDetails.steps.map((step, i) => (
              <>
                <AccordionDetails>
                  <Typography>
                    {step.instructions.replace(/<[^>]+>/g, "")}
                  </Typography>
                </AccordionDetails>
              </>
            ))}
          </Accordion>
        )}
      </Grid>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Selectează</TableCell>
                <TableCell>Nume locație</TableCell>
                <TableCell>Latitudine</TableCell>
                <TableCell>Longitudine</TableCell>
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
        <Button
          onClick={generateRoute}
          disabled={checkedSpots.length < 1 || !currentLocation}
        >
          Generează ruta
        </Button>
      </Grid>
    </Grid>
  );
};

export default Map;
