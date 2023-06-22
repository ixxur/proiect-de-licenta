import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Button,
  Checkbox,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, Typography
} from "@mui/material";
import Navbar from "../../components/Navbar";
import { API_URL } from "../../constants/url";

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(sortUsers(response.data, sortKey, sortOrder));
    };

    fetchUsers();
  }, [sortKey, sortOrder]);

  const handleDelete = async (username) => {
    try {
      await axios.delete(`${API_URL}/users/${username}`);
      setSnackbarMessage(`${username} deleted successfully`);
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbarMessage(`Something went wrong while deleting ${username}`);
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (Array.isArray(userToDelete)) {
      // if (userToDelete.length > 1 ) {
      // if array (multiple users to delete)
      await Promise.all(userToDelete.map((username) => handleDelete(username)));
      setUsers(users.filter((user) => !userToDelete.includes(user.username)));
      setSelectedUsers([]);
    } else {
      // if single string (single user to delete)
      await handleDelete(userToDelete);
      setUsers(users.filter((user) => user.username !== userToDelete));
    }
    setUserToDelete(null);
    setDialogOpen(false);
  };

  const handleDeletePrompt = (usernames) => {
    setUserToDelete(usernames);
    setDialogOpen(true);
  };

  const handleSelectUser = (username) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(username)
        ? prevSelectedUsers.filter((user) => user !== username)
        : [...prevSelectedUsers, username]
    );
  };

  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortUsers = (users, key, order = "asc") => {
    const sortedUsers = [...users].sort((a, b) => {
      if (key === "createdAt") {
        // Sort as dates
        const dateA = new Date(a[key]).getTime();
        const dateB = new Date(b[key]).getTime();
        return order === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        // Sort as strings or numbers
        if (a[key] < b[key]) {
          return order === "asc" ? -1 : 1;
        } else if (a[key] > b[key]) {
          return order === "asc" ? 1 : -1;
        } else {
          return 0;
        }
      }
    });

    return sortedUsers;
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                <TableSortLabel
                  active={sortKey === "name"}
                  direction={sortOrder}
                  onClick={() => handleSort("name")}
                >
                  <Typography fontWeight="bold">Nume</Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === "username"}
                  direction={sortOrder}
                  onClick={() => handleSort("username")}
                >
                  <Typography fontWeight="bold">Username</Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === "role"}
                  direction={sortOrder}
                  onClick={() => handleSort("role")}
                >
                   <Typography fontWeight="bold">Rol</Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortKey === "createdAt"}
                  direction={sortOrder}
                  onClick={() => handleSort("createdAt")}
                >
                  <Typography fontWeight="bold">Data înregistrării</Typography>
                </TableSortLabel>
              </TableCell>
              <TableCell><Typography fontWeight="bold">Acțiuni</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    {user.role !== "admin" && (
                      <Checkbox
                        onChange={() => handleSelectUser(user.username)}
                        checked={selectedUsers.includes(user.username)}
                      />
                    )}
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>
                    {user.role !== "admin" && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeletePrompt(user.username)}
                      >
                        Șterge
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Button
        fullWidth
        type="submit"
        variant="outlined"
        color="error"
        onClick={() => handleDeletePrompt(selectedUsers)}
      >
        Șterge utilizatorii selectați
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {Array.isArray(userToDelete) && userToDelete.length > 1
              ? "Are you sure you want to delete these users?"
              : "Are you sure you want to delete this user?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            No
          </Button>
          <Button onClick={handleDeleteConfirmed} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminUsersList;
