import { useState } from "react";
import { TextField, Button, Card, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import classes from "./Register.module.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../constants/url";

const StyledCard = styled(Card)({
  padding: "2rem",
  margin: "auto",
  marginTop: "2rem",
  maxWidth: "600px",
  textAlign: "center",
  minHeight: "70vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  borderRadius: "5%",
});

const StyledTextField = styled(TextField)({
  marginTop: "1.5rem",
});

const StyledButton = styled(Button)({
  marginTop: "2.5rem",
});

const StyledTypography = styled(Typography)({
  marginTop: "2rem",
});

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!validatePassword()) {
      return;
    }

    try {
      await axios.post(`${API_URL}/register`, {
        username: username,
        password: password,
        name: name,
      });

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const validatePassword = () => {
    let error = "";
    if (password.length < 8) {
      error = "Parola trebuie sa contina minim 8 caractere.";
    } else if (!/[a-z]/.test(password)) {
      error = "Parola trebuie sa contina minim o litera mica.";
    } else if (!/[A-Z]/.test(password)) {
      error = "Parola trebuie sa contina minim o majuscula.";
    } else if (!/\d/.test(password)) {
      error = "Parola trebuie sa contina minim un numar.";
    } else if (!/\W/.test(password)) {
      error = "Parola trebuie sa contina minim un caracter special.";
    }
    setPasswordError(error);
    return error === "";
  };

  return (
    <StyledCard>
      <Typography variant="h4" component="div" gutterBottom>
        Vreau cont
      </Typography>
      <form onSubmit={register}>
        <StyledTextField
          fullWidth
          margin="normal"
          label="Nume"
          variant="outlined"
          onChange={(event) => setName(event.target.value)}
        />
        <StyledTextField
          fullWidth
          margin="normal"
          label="Email"
          variant="outlined"
          onChange={(event) => setUsername(event.target.value)}
        />
        <StyledTextField
          fullWidth
          margin="normal"
          label="Parola"
          variant="outlined"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <StyledTextField
          fullWidth
          margin="normal"
          label="Confirma parola"
          variant="outlined"
          type="password"
          onChange={(event) => setPasswordConfirmation(event.target.value)}
        />
        {formSubmitted && passwordError && (
          <Box color="error.main">{passwordError}</Box>
        )}
        <StyledButton
          type="submit"
          variant="contained"
          disabled={password !== passwordConfirmation}
        >
          Inregistare
        </StyledButton>
      </form>
      <StyledTypography variant="body1">
        Deja ai un cont? <Link to="/login">Conecteaza-te!</Link>
      </StyledTypography>
    </StyledCard>
  );
};

export default Register;
