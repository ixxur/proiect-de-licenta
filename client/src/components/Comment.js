import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, ListItem, ListItemText } from "@mui/material";
import { format } from "timeago.js";

function Comment({ comment, username, onUpdate}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (event) => {
    setEditedText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.put(`/comments/${comment._id}`, { text: editedText });
    setIsEditing(false);
    onUpdate();
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit}>
        <TextField value={editedText} onChange={handleChange} />
        <Button type="submit">Submit</Button>
      </form>
    );
  }

  return (
    <ListItem>
      <ListItemText
        primary={comment.username}
        secondary={comment.text + " • " + format(comment.updatedAt) }
      />
      {username === comment.username && (
        <Button onClick={handleEdit}>Edit</Button>
      )}
    </ListItem>
  );
}

export default Comment;