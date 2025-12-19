import { Routes, Route } from "react-router-dom";
import Campaigns from "./pages/Campaigns";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Campaigns />} />
    </Routes>
  );
}

export default App;
