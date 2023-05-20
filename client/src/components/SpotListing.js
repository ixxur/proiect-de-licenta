import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid } from "@mui/material";
import SpotCard from "./SpotCard";

const SpotListing = () => {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    const getAllSpots = async () => {
        try {
          const spotsResponse = await axios.get("/spots");
          console.log(spotsResponse.data);
          setSpots(spotsResponse.data);

        } catch (err) {
          console.log("Error fetching spots ", err);
        }
      };
      getAllSpots();
  },[]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {spots.map((spot, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <SpotCard spot={spot} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SpotListing;
