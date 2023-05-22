import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import { TextField, Button } from "@mui/material";
import Navbar from "../../components/Navbar";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Comments from "../../components/Comments";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const SpotDetailsEditPage = () => {
  const { id } = useParams();
  const { username } = useSelector((state) => state.auth.user);
  const [spot, setSpot] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [weatherData, setWeatherData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    latitude: 0,
    longitude: 0,
    description: "",
    whenToGo: "",
    imageUrl: "",
  });
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchSpotandWeather = async () => {
      try {
        const response = await axios.get(`/spots/${id}`);
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

  if (!spot) return <div>Loading...</div>;

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Send a PUT request to the server with the new data
    try {
      const response = await axios.put(`/spots/${id}`, formData);
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
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <TextField
            name="whenToGo"
            label="When to go"
            value={formData.whenToGo}
            onChange={handleInputChange}
          />
          <TextField
            name="imageUrl"
            label="Image URL"
            value={formData.imageUrl}
            onChange={handleInputChange}
          />
          <div>
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
          </div>
          <Button type="submit">Update Spot</Button>
        </form>
        <p>Rating: </p>
        <Rating
          name="read-only"
          value={averageRating}
          precision={0.5}
          readOnly
        />
        <div>
          <Comments spotId={id} username={username} />
        </div>
      </div>
    </>
  );
};

export default SpotDetailsEditPage;
