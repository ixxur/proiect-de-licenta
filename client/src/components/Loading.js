import React from "react";
import {CircularProgress, Box} from "@mui/material";

const Loading = () => {
  return (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh' // This will center the spinner vertically.
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
