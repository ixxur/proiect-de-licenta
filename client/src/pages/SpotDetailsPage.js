import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function SpotDetailsPage() {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await axios.get(`/spots/${id}`);
        setSpot(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSpot();
  }, [id]);

  if (!spot) return <div>Loading...</div>;

  const { name, description, whenToGo, imageUrl } = spot;

  return (
    <div>
      <h1>{name}</h1>
      <img src={imageUrl} alt={name} />
      <p>{description}</p>
      <p>
        Best time to visit: {whenToGo}
      </p>
    </div>
  );
}

export default SpotDetailsPage;
