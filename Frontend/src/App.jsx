import { Routes, Route } from "react-router-dom";
import Campaigns from "./pages/Campaigns";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import CreateCampaign from "./pages/CreateCampaign";
import Donate from "./pages/Donate";
import CampaignView from "./pages/CampaignView";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
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
  );
}

export default App;
