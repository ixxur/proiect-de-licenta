import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { format } from "timeago.js";
import { useSelector } from "react-redux";
import { PROFILE_PICTURES } from "../constans/images";
import { API_URL } from "../constants/url";

function Comment({ comment, username, onUpdate }) {
  const { role } = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  // const API_URL = process.env.REACT_APP_API_URL || "http://licenta2023backend.hopto.org" || "http://localhost:5000";
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/comments/${comment._id}`);
      onUpdate();
    } catch (error) {
      console.log("Error deleting comment:", error);
    }
    setIsDeleting(false);
  };

  const handleChange = (event) => {
    setEditedText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.put(`${API_URL}/comments/${comment._id}`, { text: editedText });
    setIsEditing(false);
    onUpdate();
  };

  if (isDeleting) {
    return <p>Ștergere comentariu...</p>;
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit}>
        <TextField value={editedText} onChange={handleChange} />
        <Button type="submit">Adaugă comentariu</Button>
      </form>
    );
  }

  return (
    <ListItem>
     <ListItemAvatar>
        <Avatar>
          <img src={PROFILE_PICTURES[Math.floor(Math.random() * PROFILE_PICTURES.length)]}  style={{height: '100%', width: '100%'}} alt="profile" />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={comment.username}
        secondary={comment.text + " • " + format(comment.updatedAt)}
      />
      {(username === comment.username || role === "admin") && (
        <div>
        <Button onClick={handleEdit}>Editează</Button>
          <Button style={{ color: "red" }} onClick={handleDelete}>
          Șterge
          </Button>
        </div>
      )}
    </ListItem>
  );
}

export default Comment;
