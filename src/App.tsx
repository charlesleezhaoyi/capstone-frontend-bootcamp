import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Nav } from "./components/nav-overlay/NavOverlay";
import { Events } from "./pages/Events";
import { Members } from "./pages/Members";
import { Discussions } from "./pages/Discussions";
import { GenericOnboarding } from "./pages/GenericOnboarding";
import { CorporateOnboarding } from "./pages/CorporateOnboarding";
import { IndividualOnboarding } from "./pages/IndividualOnboarding";

// import AuthWrapper from "./components/auth0/AuthWrapper";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Nav />}>
          <Route
            path="events"
            element={
              // <AuthWrapper>
              <Events />
              // </AuthWrapper>
            }
          />
          <Route path="public-onboarding" element={<GenericOnboarding />} />
          <Route
            path="individual-onboarding"
            element={<IndividualOnboarding />}
          />
          <Route
            path="corporate-onboarding"
            element={<CorporateOnboarding />}
          />
          <Route path="members" element={<Members />} />
          <Route path="discussions" element={<Discussions />} />
        </Route>
        <Route path="*" element={<Navigate to="events" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
