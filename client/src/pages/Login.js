//import { Form } from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
//import { useSelector } from "react-redux";
import Card from "../components/Card";
import classes from "./Login.module.css";
import axios from "axios";
import { loginSuccess } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../constants/url";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [loginStatus, setLoginStatus] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const API_URL = process.env.REACT_APP_API_URL || "http://licenta2023backend.hopto.org" || "http://localhost:5000";

  axios.defaults.withCredentials = true;

  const login = async (event) => {
    event.preventDefault();
    console.log("login1");
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: username,
        password: password,
      });
      console.log("login2");
      const responseGet = await axios.get(`${API_URL}/login`, { withCredentials: true });
      console.log(responseGet.data);
      const { user } = response.data;
      console.log(user);
      const favoritesResponse = await axios.get(`${API_URL}/users/${user.username}`);
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
      console.log(error);
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
        console.log(user);
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
    window.open(`http://${API_URL}/auth/google/callback`, "_self");
  };

  return (
    <Card>
      <h1>Login Page</h1>
      <form className={classes.form} onSubmit={login}>
        <input
          id="email"
          type="email"
          placeholder="Email"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={googleAuthHandler}>Sign in with Google</button>
      <p>
        Don't have an account? <Link to="/register">Sign up!</Link>
      </p>
    </Card>
  );
};

export default Login;
