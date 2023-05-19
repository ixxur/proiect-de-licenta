import { useState } from "react";
import { useSelector } from "react-redux";
import Map from "../components/Map";
import NewSpotModal from "../components/NewSpotModal";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import SpotListing from "../components/SpotListing";

const Home = () => {
  const [showMap, setShowMap] = useState(false);
  const username = useSelector(state => state.auth.user.username);
  const handleSwitchChange = (event) => {
    setShowMap(event.target.checked);
  };

  return (
    <>
      <h1>HOME PAGE</h1>
      <FormControlLabel
        control={<Switch checked={showMap} onChange={handleSwitchChange} />}
        label="Show map"
      />
      {showMap && <Map username={username}/>}
      <NewSpotModal />
      <SpotListing />
    </>
  );
};

export default Home;
