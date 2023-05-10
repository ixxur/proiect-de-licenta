//import { Form } from "react";
import { useState } from "react";
import Card from "../components/Card";
import classes from "./Login.module.css";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/login", {
        username: username,
        password: password,
      });
      console.log(response.data);
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

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
      {isLoggedIn && <h1>{username} has logged in</h1>}
    </Card>
  );
};

export default Login;
