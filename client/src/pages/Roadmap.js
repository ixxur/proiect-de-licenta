import Navbar from "../components/Navbar";
import Map from "../components/Map";
import { Rating, Grid, Container, IconButton, Box } from "@mui/material";

const Roadmap = () => {
  return (
    <>
      <Navbar />
      <Container>
        <Box sx={{ flexGrow: 1, marginTop: 2, marginBottom: 2 }}>
          <Map />
        </Box>
      </Container>
    </>
  );
};

export default Roadmap;
