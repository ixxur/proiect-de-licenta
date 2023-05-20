import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Box, Grid, TextField, Select, MenuItem } from "@mui/material";
import SpotCard from "./SpotCard";

const SpotListing = () => {
  const [spots, setSpots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const [sortOrder, setSortOrder] = useState("none");

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
  }, []);

  console.log(spots);
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterRating = (event) => {
    setFilterRating(Number(event.target.value));
  };

  const handleSortOrder = (event) => {
    setSortOrder(String(event.target.value));
  };

  const displayedSpots = useMemo(() => {
    let result = [...spots];

    if (searchTerm) {
      result = result.filter((spot) =>
        spot.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRating > 0) {
      result = result.filter((spot) => spot.avgRating >= filterRating);
    }

    if (sortOrder !== "none") {
      result = result.sort((a, b) =>
        sortOrder === "asc" ? a.avgRating - b.avgRating : b.avgRating - a.avgRating
      );
    }

    return result;
  }, [spots, searchTerm, filterRating, sortOrder]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <TextField
        label="Search"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Select value={filterRating} onChange={handleFilterRating}>
        <MenuItem value={0}>No Filter</MenuItem>
        <MenuItem value={3}>3+</MenuItem>
        <MenuItem value={4}>4+</MenuItem>
        <MenuItem value={5}>5</MenuItem>
      </Select>
      <Select value={sortOrder} onChange={handleSortOrder}>
        <MenuItem value="none">No Sort</MenuItem>
        <MenuItem value="desc">Descending</MenuItem>
        <MenuItem value="asc">Ascending</MenuItem>
      </Select>
      <Grid container spacing={2}>
        {displayedSpots.map((spot, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <SpotCard spot={spot} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SpotListing;
