//import { Form } from "react";
import { useState } from "react";
import Card from "../components/Card";
import classes from "./Login.module.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card>
      <div>
        <h1>Login Page</h1>
        <form className={classes.form}>
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
          <button>Login</button>
        </form>
      </div>
    </Card>
  );
};

export default Login;
