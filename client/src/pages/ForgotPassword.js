import { useState } from "react";
import { TextField, Button, Card, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigate = useNavigate();

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!validatePassword()) {
        return;
      }

    try {
      const response = await axios.post("/forgot", {
        username: email,
        password: newPassword,
      });

      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.log(error);
      setError("An error occurred while resetting your password.");
    }
  };

  const validatePassword = () => {
    let error = '';
    if(newPassword.length < 8) {
      error = 'Parola trebuie să conțină minim 8 caractere.';
    } else if (!/[a-z]/.test(newPassword)) {
      error = 'Parola trebuie să conțină minim o literă mică.';
    } else if (!/[A-Z]/.test(newPassword)) {
      error = 'Parola trebuie să conțină minim o majusculă.';
    } else if (!/\d/.test(newPassword)) {
      error = 'Parola trebuie să conțină minim un numar.';
    } else if (!/\W/.test(newPassword)) {
      error = 'Parola trebuie să conțină minim un caracter special.';
    }
    setNewPassword(error);
    return error === '';
  };

  return (
    <StyledCard>
      <Typography variant="h4" component="div" gutterBottom>
        Resetează parola
      </Typography>
      <form onSubmit={handlePasswordReset}>
        <StyledTextField
          fullWidth
          label="Email"
          variant="outlined"
          onChange={(event) => setEmail(event.target.value)}
        />
        <StyledTextField
          fullWidth
          label="Parola nouă"
          variant="outlined"
          type="password"
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <StyledTextField
          fullWidth
          margin="normal"
          label="Confirmă parola"
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
          disabled={newPassword !== passwordConfirmation}
        >
          Resetează parola
        </StyledButton>
      </form>
      <StyledTypography variant="body1">
        Îți aduci aminte parola? <Link to="/login">Conectează-te acum!</Link>
      </StyledTypography>
    </StyledCard>
  );
};

export default ForgotPassword;