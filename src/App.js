import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Tasks from "./components/Tasks.js";
import Info from "./components/Info.js";
import Time from "./components/Time.js";

function App() {
  const navStyle = {
    padding: 5,
  };
  return (
    <BrowserRouter>
      <nav>
        <Link style={navStyle} to="/">
          Tasks
        </Link>
        <Link style={navStyle} to="/Time">
          Time
        </Link>
        <Link style={navStyle} to="/info">
          Info
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Tasks />} />
        <Route path="/time" element={<Time />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
