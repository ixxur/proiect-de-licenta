//import { Form } from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
//import { useSelector } from "react-redux";
import Card from "../components/Card";
import classes from "./Login.module.css";
import axios from "axios";
import { loginSuccess } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [loginStatus, setLoginStatus] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const login = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/login", {
        username: username,
        password: password,
      });
      const { user } = response.data;
      console.log(user);
      const favoritesResponse = await axios.get(`/users/${user.username}`);
      // const favoritesRes = await axios.get(
      //   `/users/${user.username}/favorites`
      // );
      const name = favoritesResponse.data.name;
      const role = favoritesResponse.data.role;
      const profilePicture = favoritesResponse.data.profilePicture;
      const registrationDate = favoritesResponse.data.createdAt;
      const favorites = favoritesResponse.data.favorites || [];
      const ratingsResponse = await axios.get(`/users/${user.username}/ratings`);
      const ratings = ratingsResponse.data.map(rating => ({ spotId: rating.spotId, rating: rating.rating }));
      //const ratings = data.data.ratings || [];
      dispatch(loginSuccess({ user, name, role, favorites, ratings, profilePicture, registrationDate }));
      console.log(user);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/login");
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
      <p>
        Don't have an account? <Link to="/register">Sign up!</Link>
      </p>
    </Card>
  );
};

export default Login;
