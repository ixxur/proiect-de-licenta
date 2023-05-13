import { Link } from "react-router-dom";

const Start = () => {
  return (
    <ul>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/home">Home</Link></li>
    </ul>
  );
};

export default Start;
