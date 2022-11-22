import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Tasks from "./components/Tasks.js";
import Info from "./components/Info.js";
import FreeTime from "./components/FreeTime.js";

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
        <Link style={navStyle} to="/freeTime">
          Free Time
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Tasks />} />
        <Route path="/info" element={<Info />} />
        <Route path="/freeTime" element={<FreeTime />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
