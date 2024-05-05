import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Events } from "./pages/Events";
import { Members } from "./pages/Members";
import { Discussions } from "./pages/Discussions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="events" element={<Events />} />
        <Route path="members" element={<Members />} />
        <Route path="discussions" element={<Discussions />} />
        <Route path="*" element={<Navigate to="events" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
