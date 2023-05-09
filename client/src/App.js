import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api");
        setMessage(response.data.message);
      } catch (error) {
        console.error("error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>{message}</h1>
      <Register />
      <Login />
    </>
  );
}

export default App;
