import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TextField, Button, Card, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { loginSuccess } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../constants/url";

const StyledCard = styled(Card)({
  padding: "2rem",
  margin: "auto",
  marginTop: "2rem",
  maxWidth: "600px",
  textAlign: "center",
  minHeight: "50vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  borderRadius: "5%",
});

const StyledTextField = styled(TextField)({
  marginTop: "1.5rem",
});

const StyledButton = styled(Button)({
  margin: "1rem",
});

const StyledTypography = styled(Typography)({
  marginTop: "1.5rem",
});

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const API_URL = process.env.REACT_APP_API_URL || "http://licenta2023backend.hopto.org" || "http://localhost:5000";
   
  axios.defaults.withCredentials = true;
 
  const login = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: username,
        password: password,
      });
      const responseGet = await axios.get(`${API_URL}/login`, {
        withCredentials: true,
      });
      // console.log(responseGet.data);
      const { user } = response.data;
      // //console.log(user);
      const favoritesResponse = await axios.get(
        `${API_URL}/users/${user.username}`
      );
      // const favoritesRes = await axios.get(
      //   `/users/${user.username}/favorites`
      // );
      const name = favoritesResponse.data.name;
      const role = favoritesResponse.data.role;
      const profilePicture = favoritesResponse.data.profilePicture;
      const registrationDate = favoritesResponse.data.createdAt;
      const favorites = favoritesResponse.data.favorites || [];
      const visited = favoritesResponse.data.visited || [];
      const ratingsResponse = await axios.get(
        `${API_URL}/users/${user.username}/ratings`
      );
      const ratings = ratingsResponse.data.map((rating) => ({
        spotId: rating.spotId,
        rating: rating.rating,
      }));
      //const ratings = data.data.ratings || [];
      dispatch(
        loginSuccess({
          user,
          name,
          role,
          favorites,
          visited,
          ratings,
          profilePicture,
          registrationDate,
        })
      );
      console.log(user);
      navigate("/home");
    } catch (error) {
      setLoginError("Email sau parola invalide.");
    }
  };

  useEffect(() => {
    console.log("useEffect login 1");
    const checkLoginStatus = async () => {
      try {
        console.log("useEffect login 2");
        const response = await axios.get("/login");
        console.log("useEffect login 3");
        console.log(response);
        const { user } = response.data;
        dispatch(loginSuccess(user));
        // setLoginStatus(user.username);
        navigate("/home");
        // console.log(user);
      } catch (error) {
        console.log(error);
      }
    };

    checkLoginStatus();
  }, [dispatch, navigate]);

  // const googleAuthHandler = () => {
  //   window.open("http://localhost:5000/auth/google/callback", "_self");
  // };
  const googleAuthHandler = () => {
    window.open(`${API_URL}/auth/google/callback`, "_self");
    console.log("AUTH GOOGLE");
  };

  return (
    <StyledCard>
      <Typography variant="h4" component="div" gutterBottom>
        Conectează-te
      </Typography>
      <form onSubmit={login}>
        <StyledTextField
          fullWidth
          label="Email"
          variant="outlined"
          onChange={(event) => setUsername(event.target.value)}
        />
        <StyledTextField
          fullWidth
          label="Parolă"
          variant="outlined"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <Typography variant="body1">
          <Link to="/forgot">Mi-am uitat parola.</Link>
        </Typography>
        {loginError && <Box color="error.main">{loginError}</Box>}
        <StyledButton type="submit" variant="contained">
          Login
        </StyledButton>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={googleAuthHandler}
        >
          Conectează-te cu Google
        </StyledButton>
      </form>
      <StyledTypography variant="body1">
        Nu ai un cont? <Link to="/register">Înregistrează-te acum!</Link>
      </StyledTypography>
    </StyledCard>
  );
};

export default Login;
