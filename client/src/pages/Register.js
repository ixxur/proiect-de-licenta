import { useState } from "react";
import Card from "../components/Card";
import classes from "./Register.module.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../constants/url";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/register`, {
        username: username,
        password: password,
        name: name,
      });

      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <h1>Inregistreaza un cont</h1>
      <form className={classes.form} onSubmit={register}>
      <input
          id="nameReg"
          type="text"
          placeholder="Nume"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
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
          placeholder="Parola"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <input
          id="passwordConfirm"
          type="password"
          placeholder="Confirma parola"
          onChange={(event) => {
            setPasswordConfirmation(event.target.value);
          }}
        />
        {password === passwordConfirmation ? (
          <button type="submit">Inregistrare</button>
        ) : (
          <p>Parolele nu sunt la fel.</p>
        )}
      </form>
      <p>
        Ai deja un cont? <Link to="/login">Conecteaza-te!</Link>
      </p>
    </Card>
  );
};

export default Register;
