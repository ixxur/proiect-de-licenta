import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api");
        setMessage(response.data.message);
      } catch (error) {
        console.error("error fetchinf data: ", error);
      }
    };

    fetchData();
  }, []);

  return <h1>{message}</h1>;
}

export default App;
