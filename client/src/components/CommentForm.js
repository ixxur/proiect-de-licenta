import React, { useState } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import { useSelector } from "react-redux";

const CommentForm = ({ spotId, username, onUpdate }) => {
  const { role } = useSelector((state) => state.auth.user);
  const [text, setText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.post(`/spots/${spotId}/comments`, {
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
          label="Leave a comment"
          variant="outlined"
          fullWidth
          multiline
          rows={1}
          margin="normal"
        />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    );
  }
};

export default CommentForm;
