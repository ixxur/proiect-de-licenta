import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import axios from "axios";
import classes from "./Navbar.module.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const role = user.role;
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
