import React, { useState } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { API_URL } from "../constants/url";

const CommentForm = ({ spotId, username, onUpdate }) => {
  const { role } = useSelector((state) => state.auth.user);
  const [text, setText] = useState("");

  // const API_URL = process.env.REACT_APP_API_URL || "http://licenta2023backend.hopto.org" || "http://localhost:5000";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.post(`${API_URL}/spots/${spotId}/comments`, {
      username,
      text,
    });
    setText("");
    onUpdate(response.data);
  };

  if (role !== "admin") {
    return (
      <form onSubmit={handleSubmit}>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Lasă un comentariu"
          variant="outlined"
          fullWidth
          multiline
          rows={1}
          margin="normal"
        />
        <Button type="submit" variant="contained">
          Adaugă comentariu
        </Button>
      </form>
    );
  }
};

export default CommentForm;
