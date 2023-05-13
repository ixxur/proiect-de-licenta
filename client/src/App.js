import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Start from "./pages/Start";
import Home from "./pages/Home";
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
        dispatch(loginSuccess(user));
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
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          element={isLoggedIn ? <ProtectedRoutes /> : <Navigate to="/login" />}
        >
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
