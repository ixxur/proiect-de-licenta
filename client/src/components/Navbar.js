import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import axios from "axios";
import classes from "./Navbar.module.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const role = user.role;
  console.log(role);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/logout");
      dispatch(logout(user));
      console.log(response.data.message);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <NavLink to="/home" end={true} className={classes.navLink}>
            Home
          </NavLink>
        </Typography>
        {role === "regular" && (
          <>
            <Typography variant="h6">
              <NavLink to="/favorites" className={classes.navLink}>
                Favorites
              </NavLink>
            </Typography>
          </>
        )}
        {role === "admin" && (
          <>
            <Typography variant="h6">
              <NavLink to="/admin/dashboard" className={classes.navLink}>
                Dashboard
              </NavLink>
            </Typography>
            <Typography variant="h6">
              <NavLink to="/admin/spots" className={classes.navLink}>
                Spots
              </NavLink>
            </Typography>
            <Typography variant="h6">
              <NavLink to="/admin/users" className={classes.navLink}>
                Users
              </NavLink>
            </Typography>
          </>
        )}
        <Typography variant="h6">
          <NavLink to="/profile" className={classes.navLink}>
            Profile
          </NavLink>
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
