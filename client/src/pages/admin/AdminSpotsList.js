// import React, { useEffect, useState } from "react";
// import axios from "axios"; // import our axios instance
// import { Link } from "react-router-dom";
// import Navbar from "../../components/Navbar";

// function AdminSpotsList() {
//   const [spots, setSpots] = useState([]);

//   useEffect(() => {
//     const fetchSpots = async () => {
//       try {
//         const response = await axios.get("/spots");
//         setSpots(response.data);
//       } catch (error) {
//         console.error("Failed to fetch spots", error);
//       }
//     };

//     fetchSpots();
//   }, []);

//   const deleteSpot = async (id) => {
//     try {
//       await axios.delete(`/spots/${id}`);
//       // Remove the deleted spot from the state
//       setSpots(spots.filter((spot) => spot._id !== id));
//     } catch (error) {
//       console.error(`Failed to delete spot with id ${id}`, error);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="adminSpotList">
//         {spots.map((spot) => (
//           <div key={spot._id} className="adminSpotList__item">
//             <h2>{spot.name}</h2>
//             <p>{spot.description.substring(0, 100)+ "..."} </p>
//             <div className="adminSpotList__buttons">
//               <Link to={`/admin/spot/${spot._id}`}>View more</Link>
//               <Link to={`/admin/spot/${spot._id}/edit`}>Edit</Link>
//               <button onClick={() => deleteSpot(spot._id)}>Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

// export default AdminSpotsList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TableSortLabel } from "@mui/material";
import Navbar from "../../components/Navbar";

function AdminSpotsList() {
  const [spots, setSpots] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await axios.get("/spots");
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

  return (
    <>
      <Navbar />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === "name"}
                  direction={sortOrder}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Description</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === "avgRating"}
                  direction={sortOrder}
                  onClick={() => handleSort("avgRating")}
                >
                  Rating
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spots.map((spot) => (
              <TableRow key={spot._id}>
                <TableCell component="th" scope="row">
                  <img src={spot.imageUrl} alt={spot.name} style={{ width: "100px" }}/>
                </TableCell>
                <TableCell>{spot.name}</TableCell>
                <TableCell>{spot.description.substring(0, 100)+ "..."}</TableCell>
                <TableCell>{spot.avgRating}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/admin/spot/${spot._id}`} variant="outlined" color="primary">View more</Button>
                  <Button component={Link} to={`/admin/spot/${spot._id}/edit`} variant="outlined" color="primary">Edit</Button>
                  <Button onClick={() => deleteSpot(spot._id)} variant="outlined" color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default AdminSpotsList;
