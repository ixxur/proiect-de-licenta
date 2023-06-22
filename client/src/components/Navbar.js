import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import axios from "axios";
import classes from "./Navbar.module.css";
import { API_URL } from "../constants/url";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const role = user.role;
  const navigate = useNavigate();

  // const API_URL = process.env.REACT_APP_API_URL || "http://licenta2023backend.hopto.org" || "http://localhost:5000";

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}/logout`);
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
        <Box display="flex" justifyContent="space-between" width="100%">
        <Box display="flex" justifyContent="flex-start">
            <Typography variant="h6" style={{ marginRight: '30px' }}>
              <NavLink to="/home" end={true} className={classes.navLink}>
                Acasă
              </NavLink>
            </Typography>
            {role === "regular" && (
              <>
                <Typography variant="h6" style={{ marginRight: '30px' }}>
                  <NavLink to="/roadmap" className={classes.navLink}>
                    Roadmap
                  </NavLink>
                </Typography>
              </>
            )}
            {role === "admin" && (
              <>
                <Typography variant="h6" style={{ marginRight: '30px' }}>
                  <NavLink to="/admin/spot/add" className={classes.navLink}>
                    Adaugă 
                  </NavLink>
                </Typography>
                <Typography variant="h6" style={{ marginRight: '30px' }}>
                  <NavLink to="/admin/spots" className={classes.navLink}>
                    Atracții
                  </NavLink>
                </Typography>
                <Typography variant="h6" style={{ marginRight: '30px' }}>
                  <NavLink to="/admin/users" className={classes.navLink}>
                    Utilizatori
                  </NavLink>
                </Typography>
              </>
            )}
            <Typography variant="h6" style={{ marginRight: '30px' }}>
              <NavLink to="/profile" className={classes.navLink}>
                Profil
              </NavLink>
            </Typography>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button color="inherit" onClick={handleLogout}>
              Ieșire
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
