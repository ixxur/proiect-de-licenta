import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemText } from "@mui/material";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { API_URL } from "../constants/url";

const Comments = ({ spotId, username }) => {
  const [comments, setComments] = useState([]);

  // const API_URL = process.env.REACT_APP_API_URL || "http://licenta2023backend.hopto.org" || "http://localhost:5000";

  const refreshComments = async () => {
    const response = await axios.get(`${API_URL}/spots/${spotId}/comments`);
    setComments(response.data);
    //console.log(response.data);
  };

  useEffect(() => {
    refreshComments();
  }, [spotId]);

  return (
    <div>
      <h3>Comentarii: </h3>
      {comments.length === 0 && <h4>Inca nu sunt comentarii.</h4>}
      <List>
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            username={username}
            onUpdate={refreshComments}
          />
        ))}
      </List>
      <CommentForm
        spotId={spotId}
        username={username}
        onUpdate={refreshComments}
      />
    </div>
  );
};

export default Comments;
