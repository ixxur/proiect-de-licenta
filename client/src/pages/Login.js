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
      dispatch(loginSuccess(user));
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
        <p>Don't have an account? <Link to="/register">Sign up!</Link></p>
    </Card>
  );
};

export default Login;
