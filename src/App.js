import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Tasks from "./components/Tasks.js";
import Info from "./components/Info.js";
import Faq from "./components/Faq.js";

function App() {
  const navStyle = {
    padding: 5
  };
  return (
    <BrowserRouter>
      <nav>
        <Link style={navStyle} to="/">
          Tasks
        </Link>
        <Link style={navStyle} to="/info">
          Info
        </Link>
        <Link style={navStyle} to="/faq">
          Faq
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Tasks />} />
        <Route path="/info" element={<Info />} />
        <Route path="/faq" element={<Faq />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
