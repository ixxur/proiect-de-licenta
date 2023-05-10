//import { Form } from "react";
import { useEffect, useState } from "react";
//import { useDispatch } from 'react-redux';
import Card from "../components/Card";
import classes from "./Login.module.css";
import axios from "axios";
//import { loginSuccess } from '../store/authSlice';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  //const dispatch = useDispatch();

  axios.defaults.withCredentials = true;

  const login = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/login", {
        username: username,
        password: password,
      });
      if(response.data.message){
        setLoginStatus(response.data.message)
      } else {
        setLoginStatus(response.data.user.username)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/login");
        const { user } = response.data;
        setLoginStatus(response.data.user.username)
        console.log(user);
      } catch (error) {
        console.log(error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <Card>
      <div>
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
      </div>
      {loginStatus !== '' && <h1>{loginStatus}</h1>}
    </Card>
  );
};

export default Login;
