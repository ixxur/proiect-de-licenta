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
import ProtectedAdminRoutes from "./utils/ProtectedAdminRoutes";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "./store/authSlice";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSpotsList from "./pages/admin/AdminSpotsList";
import AdminUsersList from "./pages/admin/AdminUsersList";
import SpotDetailsEditPage from "./pages/admin/SpotDetailsEditPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { role } = useSelector((state) => state.auth.user);

  useEffect(() => {
    const checkLoginStatus = async () => {
      console.log("useEffect app 1");
      try {
        const response = await axios.get("/login", { withCredentials: true });
        console.log("useEffect app 2");
        const { user } = response.data;
        console.log(response);
        // const favoritesRes = await axios.get(
        //   `/users/${user.username}/favorites`
        // );
        const favoritesResponse = await axios.get(`/users/${user.username}`);
        console.log(favoritesResponse);
        console.log(favoritesResponse.data.favorites);
        const name = favoritesResponse.data.name;
        const role = favoritesResponse.data.role;
        const profilePicture = favoritesResponse.data.profilePicture;
        const registrationDate = favoritesResponse.data.createdAt;
        //const favorites = favoritesRes.data || [];
        const favorites = favoritesResponse.data.favorites || [];
        const visited = favoritesResponse.data.visited || [];
        const ratingsResponse = await axios.get(
          `/users/${user.username}/ratings`
        );
        const ratings = ratingsResponse.data.map((rating) => ({
          spotId: rating.spotId,
          rating: rating.rating,
        }));
        //const ratings = data.data.ratings || [];
        console.log(ratings);
        console.log(favorites);
        console.log(user);
        console.log(response.data);
        dispatch(
          loginSuccess({
            user,
            name,
            role,
            favorites,
            visited,
            ratings, 
            profilePicture,
            registrationDate,
          })
        );
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
            <Route path="/profile" element={<Profile />} />
            <Route path="/spot/:id" element={<SpotDetailsPage />} />
          </Route>
          <Route
            path="/admin"
            element={
              isLoggedIn && role === "admin" ? (
                <ProtectedAdminRoutes />
              ) : (
                <Navigate to="/login" />
              )
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/spots" element={<AdminSpotsList />} />
            <Route path="/admin/spot/:id" element={<SpotDetailsPage />} />
            <Route
              path="/admin/spot/:id/edit"
              element={<SpotDetailsEditPage />}
            />
            <Route path="/admin/users" element={<AdminUsersList />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </LoadScript>
    </BrowserRouter>
  );
}

export default App;
