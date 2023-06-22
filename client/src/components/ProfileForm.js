import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserData } from "../store/authSlice";
import {
  TextField,
  Button,
  Avatar,
  Grid,
  Modal,
  Box,
  Card,
} from "@mui/material";
import Profile1 from "../assets/pictures/profile-pictures/profile1.png";
import Profile2 from "../assets/pictures/profile-pictures/profile2.png";
import Profile3 from "../assets/pictures/profile-pictures/profile3.png";
import Profile4 from "../assets/pictures/profile-pictures/profile4.png";
import Profile5 from "../assets/pictures/profile-pictures/profile5.png";
import Profile6 from "../assets/pictures/profile-pictures/profile6.png";
import Profile7 from "../assets/pictures/profile-pictures/profile7.png";
import Profile8 from "../assets/pictures/profile-pictures/profile8.png";
import Profile9 from "../assets/pictures/profile-pictures/profile9.png";
import classes from "./ProfileForm.module.css";
import { styled } from "@mui/system";

const profileImages = [
  Profile1,
  Profile2,
  Profile3,
  Profile4,
  Profile5,
  Profile6,
  Profile7,
  Profile8,
  Profile9,
];

const StyledCard = styled(Card)({
  padding: "2rem",
  margin: "auto",
  marginTop: "2rem",
  maxWidth: "600px",
  textAlign: "center",
  minHeight: "40vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  borderRadius: "5%",
});

const ProfileForm = ({ user }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState(user.name);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await dispatch(
        updateUserData({
          ...user,
          name,
          profilePicture,
        })
      );

      if (updateUserData.rejected.match(response)) {
        setError("Update failed:" + response.error.message);
      } else {
        setIsEditing(false);
        setError(null);
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }
  };

  const handleProfilePictureChange = (newPictureIndex) => {
    setProfilePicture(newPictureIndex);
    setOpenModal(false);
  };

  return (
    <StyledCard>
      <Box
        className={classes.root}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3, 
          marginTop: "5em",
        }}
      >
        <Avatar
          style={{ width: "100px", height: "100px" }}
          src={profileImages[profilePicture]}
          alt="Profile picture"
        />
        {isEditing && (
          <Button onClick={() => setOpenModal(true)}>
          Schimbă poza de profil
          </Button>
        )}
        <TextField
          fullWidth
          className={classes.textField}
          label="Nume"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!isEditing}
        />
        <TextField
          fullWidth
          className={classes.textField}
          label="Username"
          value={user.username}
          disabled
        />
        <TextField
          fullWidth
          className={classes.textField}
          label="Membru din"
          value={user.registrationDate}
          disabled
        />
        <Button
          onClick={isEditing ? handleSubmit : () => setIsEditing(!isEditing)}
        >
          {isEditing ? "Salvează modificările" : "Editează profilul"}
        </Button>
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400, 
              bgcolor: "background.paper",
              border: "2px solid grey",
              boxShadow: 24,
              p: 4,
              borderRadius: "5%",
            }}
          >
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={3}
            >
              {profileImages.map((picture, index) => (
                <Grid
                  item
                  xs={4}
                  key={index}
                  onClick={() => handleProfilePictureChange(index)}
                >
                  <img
                    src={picture}
                    alt={`Option ${index + 1}`}
                    className={`${classes.image} ${
                      profilePicture === index ? classes.selected : ""
                    }`}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Modal>
        {error && <p>{error}</p>}
      </Box>
    </StyledCard>
  );
};

export default ProfileForm;
