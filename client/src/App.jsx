import React from "react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import { Routes , Route } from "react-router-dom";
import MainDashboard from "./pages/MainDashboard";


const App = () => {
  return (
    <div className="w-full h-screen google-sans bg-[#e5e5e5]">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<MainDashboard />} />
      </Routes>
    </div>
  );
};

export default App;
