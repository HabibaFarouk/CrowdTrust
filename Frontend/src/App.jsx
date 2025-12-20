import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Campaigns from "./pages/Campaigns";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import CreateCampaign from "./pages/CreateCampaign";
import Donate from "./pages/Donate";
import CampaignView from "./pages/CampaignView";
import ErrorPage from "./pages/ErrorPage";
import { setMessageCallback } from "./api";
import "./App.css";

function App() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setMessageCallback(({ type, text }) => {
      setMessage({ type, text });
      setTimeout(() => setMessage(null), 4000); // Auto-hide after 4 seconds
    });
  }, []);

  return (
    <div>
      {message && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: message.type === "error" ? "#ff6b6b" : "#51cf66",
          color: "white",
          padding: "15px 20px",
          borderRadius: "8px",
          zIndex: 9999,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          fontSize: "14px",
          fontWeight: "500",
          maxWidth: "400px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "right"
        }}>
          {message.text}
        </div>
      )}
      <Routes>
        <Route path="/" element={<Campaigns />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/donate/:id" element={<Donate />} />
        <Route path="/campaign/:id" element={<CampaignView />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
