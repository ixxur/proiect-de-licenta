import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  Container,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SpotCard from "./SpotCard";
import { useSelector } from "react-redux";
import { API_URL } from "../constants/url";

const SpotListing = () => {
  const user = useSelector((state) => state.auth.user);

  const [spots, setSpots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const [sortOrder, setSortOrder] = useState("none");
  const [filterVisited, setFilterVisited] = useState(false);
  const [filterFavorites, setFilterFavorites] = useState(false);

  // const API_URL = process.env.REACT_APP_API_URL || "http://licenta2023backend.hopto.org" || "http://localhost:5000";
  
  useEffect(() => {
    const getAllSpots = async () => {
      try {
        const spotsResponse = await axios.get(`${API_URL}/spots`);
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

  const handleFilterVisited = (event) => {
    setFilterVisited(event.target.checked);
  };
  
  const handleFilterFavorites = (event) => {
    setFilterFavorites(event.target.checked);
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
        sortOrder === "asc"
          ? a.avgRating - b.avgRating
          : b.avgRating - a.avgRating
      );
    }

    if (filterVisited) {
      result = result.filter((spot) => user.visited.includes(spot._id));
    }

    if (filterFavorites) {
      result = result.filter((spot) => user.favorites.includes(spot._id));
    }

    return result;
  }, [
    spots,
    searchTerm,
    filterRating,
    sortOrder,
    filterVisited,
    filterFavorites,
  ]);

  return (
    <Container>
      <Box sx={{ flexGrow: 1, marginTop: 2, marginBottom: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Caută"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Select
              value={filterRating}
              onChange={handleFilterRating}
              fullWidth
            >
              <MenuItem value={0}>Fără filtrare</MenuItem>
              <MenuItem value={1}>1+</MenuItem>
              <MenuItem value={2}>2+</MenuItem>
              <MenuItem value={3}>3+</MenuItem>
              <MenuItem value={4}>4+</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Select value={sortOrder} onChange={handleSortOrder} fullWidth>
            <MenuItem value="none">Fără sortare</MenuItem>
              <MenuItem value="desc">Rating descrescător</MenuItem>
              <MenuItem value="asc">Rating crescător</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterVisited}
                  onChange={handleFilterVisited}
                />
              }
              label="Arată atracțiile vizitate"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterFavorites}
                  onChange={handleFilterFavorites}
                />
              }
              label="Arată atracțiile favorite"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} marginTop={2}>
          {displayedSpots.map((spot, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <SpotCard spot={spot} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default SpotListing;
