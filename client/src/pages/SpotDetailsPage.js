import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Comments from "../components/Comments";
import CommentForm from "../components/CommentForm";
import { useSelector } from "react-redux";

const SpotDetailsPage = () => {
  const { username } = useSelector((state) => state.auth.user);
  console.log(username);
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  //const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await axios.get(`/spots/${id}`);
        setSpot(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSpot();
  }, [id]);

  if (!spot) return <div>Loading...</div>;

  const { name, description, whenToGo, imageUrl } = spot;

  // const handleCommentSubmit = (comment) => {
  //   setComments([comment, ...comments]);
  // };

  return (
    <>
      <div>
        <h1>{name}</h1>
        <img src={imageUrl} alt={name} />
        <p>{description}</p>
        <p>Best time to visit: {whenToGo}</p>
      </div>
      <div>
        <Comments spotId={id} username={username} />
      </div>
    </>
  );
};

export default SpotDetailsPage;
