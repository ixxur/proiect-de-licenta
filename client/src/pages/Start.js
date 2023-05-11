import { NavLink } from "react-router-dom";

const Start = () => {
  return (
    <ul>
      <li>
        <NavLink to="/login">Login</NavLink>
      </li>
      <li><NavLink to="/register">Register</NavLink></li>
      <li><NavLink to="/home">Home</NavLink></li>
    </ul>
  );
};

export default Start;
