import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemText } from "@mui/material";
import CommentForm from "./CommentForm";
import Comment from "./Comment";


function Comments({ spotId, username }) {
  const [comments, setComments] = useState([]);

  const refreshComments = async () => {
    const response = await axios.get(`/spots/${spotId}/comments`);
    setComments(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    refreshComments();
  }, [spotId]);

  return (
    <div>
      <h3>Comentarii: </h3>
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
}

export default Comments;
