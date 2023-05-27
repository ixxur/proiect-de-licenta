import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TablePagination, TableHead, TableRow, Paper, Button, TableSortLabel } from "@mui/material";
import Navbar from "../../components/Navbar";

function AdminSpotsList() {
  const [spots, setSpots] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const API_URL = process.env.REACT_APP_API_URL || "http://licenta2023backend.hopto.org" || "http://localhost:5000";
  
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await axios.get(`${API_URL}/spots`);
        setSpots(sortSpots(response.data, sortKey, sortOrder));
      } catch (error) {
        console.error("Failed to fetch spots", error);
      }
    };

    fetchSpots();
  }, [sortKey, sortOrder]);

  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortSpots = (spots, key, order = "asc") => {
    const sortedSpots = [...spots].sort((a, b) => {
      if (a[key] < b[key]) {
        return order === "asc" ? -1 : 1;
      } else if (a[key] > b[key]) {
        return order === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });

    return sortedSpots;
  };

  const deleteSpot = async (id) => {
    try {
      await axios.delete(`/spots/${id}`);
      // Remove the deleted spot from the state
      setSpots(spots.filter((spot) => spot._id !== id));
    } catch (error) {
      console.error(`Failed to delete spot with id ${id}`, error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Navbar />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Image</TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={sortKey === "name"}
                  direction={sortOrder}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={sortKey === "avgRating"}
                  direction={sortOrder}
                  onClick={() => handleSort("avgRating")}
                >
                  Rating
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spots
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((spot) => (
              <TableRow key={spot._id}>
                <TableCell align="center" component="th" scope="row">
                  <img src={spot.imageUrl} alt={spot.name} style={{ width: "100px" }}/>
                </TableCell>
                <TableCell align="center">{spot.name}</TableCell>
                <TableCell align="center">{spot.description.substring(0, 100)+ "..."}</TableCell>
                <TableCell align="center">{spot.avgRating}</TableCell>
                <TableCell align="center">
                  <Button component={Link} to={`/admin/spot/${spot._id}`} variant="outlined" color="primary">View more</Button>
                  <Button component={Link} to={`/admin/spot/${spot._id}/edit`} variant="outlined" color="secondary">Edit</Button>
                  <Button onClick={() => deleteSpot(spot._id)} variant="outlined" color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={spots.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </>
  );
}

export default AdminSpotsList;
