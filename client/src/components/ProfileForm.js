import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserData } from '../store/authSlice';
import { TextField, Button, Avatar, Grid, Modal, Box, Typography } from '@mui/material';
import Profile1 from '../assets/pictures/profile-pictures/profile1.png';
import Profile2 from '../assets/pictures/profile-pictures/profile2.png';
import Profile3 from '../assets/pictures/profile-pictures/profile3.png';
import Profile4 from '../assets/pictures/profile-pictures/profile4.png';
import Profile5 from '../assets/pictures/profile-pictures/profile5.png';
import Profile6 from '../assets/pictures/profile-pictures/profile6.png';
import Profile7 from '../assets/pictures/profile-pictures/profile7.png';
import Profile8 from '../assets/pictures/profile-pictures/profile8.png';
import Profile9 from '../assets/pictures/profile-pictures/profile9.png';
import classes from "./ProfileForm.module.css";

const profileImages = [Profile1, Profile2, Profile3, Profile4, Profile5, Profile6, Profile7, Profile8, Profile9];

const ProfileForm = ({user}) => {
  const dispatch = useDispatch();
  
  const [name, setName] = useState(user.name);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await dispatch(updateUserData({
        ...user,
        name,
        profilePicture,
      }));

      if (updateUserData.rejected.match(response)) {
        setError('Update failed:' + response.error.message);
      } else {
        setIsEditing(false);
        setError(null);
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };
  
  const handleProfilePictureChange = (newPictureIndex) => {
    setProfilePicture(newPictureIndex);
    setOpenModal(false);
  };

  return (
    <Box className={classes.root}>
    <Avatar className={classes.avatar} src={profileImages[profilePicture]} alt="Profile picture"/>
    {isEditing && <Button onClick={() => setOpenModal(true)}>Change Profile Picture</Button>}
    <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
    <TextField label="Username" value={user.username} disabled/>
    <Typography>Member since {user.registrationDate}</Typography>
    <Button onClick={isEditing ? handleSubmit : () => setIsEditing(!isEditing)}>{isEditing ? "Save Changes" : "Edit Profile"}</Button>
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
    >
      <Grid container justifyContent="center">
        {profileImages.map((picture, index) => (
          <Grid item xs={4} key={index} onClick={() => handleProfilePictureChange(index)}>
            <img 
              src={picture} 
              alt={`Option ${index + 1}`}
              className={`${classes.image} ${profilePicture === index ? classes.selected : ''}`} 
            />
          </Grid>
        ))}
      </Grid>
    </Modal>
    {error && <p>{error}</p>}
  </Box>
);
};

export default ProfileForm;