import React, { useEffect, useState } from "react";
import axios from "axios"; // import our axios instance
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function AdminSpotsList() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await axios.get("/spots");
        setSpots(response.data);
      } catch (error) {
        console.error("Failed to fetch spots", error);
      }
    };

    fetchSpots();
  }, []);

  const deleteSpot = async (id) => {
    try {
      await axios.delete(`/spots/${id}`);
      // Remove the deleted spot from the state
      setSpots(spots.filter((spot) => spot._id !== id));
    } catch (error) {
      console.error(`Failed to delete spot with id ${id}`, error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="adminSpotList">
        {spots.map((spot) => (
          <div key={spot._id} className="adminSpotList__item">
            <h2>{spot.name}</h2>
            <p>{spot.description.substring(0, 100)+ "..."} </p>
            <div className="adminSpotList__buttons">
              <Link to={`/admin/spot/${spot._id}`}>View more</Link>
              <Link to={`/admin/spot/${spot._id}/edit`}>Edit</Link>
              <button onClick={() => deleteSpot(spot._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AdminSpotsList;
