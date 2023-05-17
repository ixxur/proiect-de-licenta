import React, { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import axios from "axios";
import DetailsModal from "./DetailsModal";
import blueMarker from "../assets/pictures/blue-marker.png";
import redMarker from "../assets/pictures/red-marker.png";

const containerStyle = {
  width: "100%",
  height: "800px",
};

const center = {
  lat: 45.9432,
  lng: 24.9668,
};

const Map = ({ username }) => {
  const [spots, setSpots] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    const getAllSpots = async () => {
      try {
        const spotsResponse = await axios.get("/spots");
        const userResponse = await axios.get(`/users/${username}/`);
        console.log(userResponse.data);
        setSpots(spotsResponse.data);
        setFavorites(userResponse.data.favorites);
      } catch (err) {
        console.log("Error fetching spots ", err);
      }
    };
    getAllSpots();
  }, [username]);

  const handleClick = (spot) => {
    setSelectedSpot(spot);
    setDetailsModalOpen(true);
  };

  const handleClose = () => {
    setSelectedSpot(null);
    setDetailsModalOpen(false);
  };

  return (
    <>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7.8}>
        {spots.map((spot) => (
          <Marker
            key={spot._id}
            position={{ lat: spot.latitude, lng: spot.longitude }}
            onClick={() => handleClick(spot)}
            icon={favorites.includes(spot._id) ? redMarker : blueMarker}
          />
        ))}
      </GoogleMap>
      <DetailsModal
        spot={selectedSpot}
        open={detailsModalOpen}
        onClose={handleClose}
      />
    </>
  );
};

export default Map;
