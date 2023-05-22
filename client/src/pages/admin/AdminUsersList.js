import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Checkbox, TableSortLabel, Snackbar, Alert, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, } from "@mui/material";
import Navbar from "../../components/Navbar";

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

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("/users");
      setUsers(sortUsers(response.data, sortKey, sortOrder));
    };

    fetchUsers();
  }, [sortKey, sortOrder]);

  const handleDelete = async (username) => {
    try {
      await axios.delete(`/users/${username}`);
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
      await Promise.all(userToDelete.map(username => handleDelete(username)));
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

//   const handleDeleteSelectedUsers = async () => {
//     openDialog();
//     // Wait for all delete requests to complete
//     await Promise.all(selectedUsers.map((username) => handleDelete(username)));
  
//     // Remove deleted users from state
//     setUsers(users.filter((user) => !selectedUsers.includes(user.username)));
  
//     setSelectedUsers([]);
//   };

//   const openDialog = () => {
//     setDialogOpen(true);
//   };

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

  return (
    <>
      <Navbar /> <h1>Users List</h1>
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>
              <TableSortLabel
                active={sortKey === "name"}
                direction={sortOrder}
                onClick={() => handleSort("name")}
              >
                Name
              </TableSortLabel>
            </th>
            <th>
              <TableSortLabel
                active={sortKey === "username"}
                direction={sortOrder}
                onClick={() => handleSort("username")}
              >
                Username
              </TableSortLabel>
            </th>
            <th>
              <TableSortLabel
                active={sortKey === "role"}
                direction={sortOrder}
                onClick={() => handleSort("role")}
              >
                Role
              </TableSortLabel>
            </th>
            <th>
              <TableSortLabel
                active={sortKey === "createdAt"}
                direction={sortOrder}
                onClick={() => handleSort("createdAt")}
              >
                Registration Date
              </TableSortLabel>
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                {user.role !== "admin" && (
                  <Checkbox
                    onChange={() => handleSelectUser(user.username)}
                    checked={selectedUsers.includes(user.username)}
                  />
                )}
              </td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{new Date(user.createdAt).toLocaleDateString("en-GB")}</td>
              <td>
                {user.role !== "admin" && (
                  <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeletePrompt(user.username)}
                >
                  Delete
                </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleDeletePrompt(selectedUsers)}
      >
        Delete Selected Users
      </Button>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {Array.isArray(userToDelete) && userToDelete.length > 1 ? "Are you sure you want to delete these users?" : "Are you sure you want to delete this user?"}
            {/* {userToDelete && userToDelete.length > 1 ? "Are you sure you want to delete these users?" : "Are you sure you want to delete this user?"} */}
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
