import { useState } from "react";
import Card from "../components/Card";
import classes from "./Register.module.css";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const register = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/register", {
        username: username,
        password: password,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <div>
        <h1>Registration Page</h1>
        <form className={classes.form} onSubmit={register}>
          <input
            id="emailReg"
            type="email"
            placeholder="Email"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            id="passwordReg"
            type="password"
            placeholder="Password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <input
            id="passwordConfirm"
            type="password"
            placeholder="Re-enter password"
            onChange={(event) => {
              setPasswordConfirmation(event.target.value);
            }}
          />
          {password === passwordConfirmation ? (
            <button type="submit">Register</button>
          ) : (
            <p>The password doesn't match.</p>
          )}
        </form>
      </div>
    </Card>
  );
};

export default Register;
