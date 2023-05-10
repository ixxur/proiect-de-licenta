import { useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RootLayout from "./pages/Root";
import Start from "./pages/Start";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Start /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "home", elemnt: <Home /> },
    ],
  },
]);

function App() {
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("/api");
  //       setMessage(response.data.message);
  //     } catch (error) {
  //       console.error("error fetching data: ", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return <RouterProvider router={router} />;
}

export default App;
