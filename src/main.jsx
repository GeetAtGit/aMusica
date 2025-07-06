// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { PlayerProvider } from "./context/PlayerContext";

import App from "./App.jsx";
import "./index.css"; // Import your Tailwind CSS styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </React.StrictMode>
);
