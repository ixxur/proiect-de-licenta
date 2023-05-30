import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import { TextField, Button, Table, TableCell, TableRow } from "@mui/material";
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

  // const API_URL = process.env.REACT_APP_API_URL || "http://licenta2023backend.hopto.org" || "http://localhost:5000";

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
      // Here you could refresh the page, or display a success message, etc.
    } catch (error) {
      console.log("Error updating spot:", error);
    }
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
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Image URL</TableCell>
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
              <TableCell>Description</TableCell>
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
              <TableCell>When to go</TableCell>
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
                    setFormData({ ...formData, latitude: lat, longitude: lng });
                  }}
                >
                  {location && <Marker position={location} />}
                </GoogleMap>
              </TableCell>
            </TableRow>
          </Table>
          <Button fullWidth type="submit" variant="outlined" color="primary">
            Update Spot
          </Button>
        </form>
        <Comments spotId={id} username={username} />
      </div>
    </>
  );
};

export default SpotDetailsEditPage;
