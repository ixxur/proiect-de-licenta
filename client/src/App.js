import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import { LoadScript } from "@react-google-maps/api";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Start from "./pages/Start";
import Home from "./pages/Home";
import SpotDetailsPage from "./pages/SpotDetailsPage";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "./store/authSlice";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/login", { withCredentials: true });
        const { user } = response.data;
        // const favoritesRes = await axios.get(
        //   `/users/${user.username}/favorites`
        // );
        const data = await axios.get(`/users/${user.username}`);
        console.log(data);
        console.log(data.data.favorites);
        console.log(data.data.ratings);
        //const favorites = favoritesRes.data || [];
        const favorites = data.data.favorites || [];
        const ratings = data.data.ratings || [];
        console.log(favorites);
        console.log(user);
        console.log(response.data);
        dispatch(loginSuccess({user, favorites, ratings}));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
          />
          <Route
            element={
              isLoggedIn ? <ProtectedRoutes /> : <Navigate to="/login" />
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/spot/:id" element={<SpotDetailsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </LoadScript>
    </BrowserRouter>
  );
}

export default App;
