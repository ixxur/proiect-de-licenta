import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ProfileForm from "../components/ProfileForm";

const Profile = () => {
    const user = useSelector((state) => state.auth.user);
  return (
    <>
      <Navbar />
      <ProfileForm user={user}/>
    </>
  );
};

export default Profile;
