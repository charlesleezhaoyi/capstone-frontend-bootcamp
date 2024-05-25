import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";
import { Nav } from "./components/nav-overlay/NavOverlay";
import { Events } from "./pages/Events";
import { EventPage } from "./pages/EventPage";
import { Members } from "./pages/Members";
import { Discussions } from "./pages/Discussions";
import { GenericOnboarding } from "./pages/GenericOnboarding";
import { CorporateOnboarding } from "./pages/CorporateOnboarding";
import { IndividualOnboarding } from "./pages/IndividualOnboarding";
import AuthWrapper from "./components/auth0/AuthWrapper";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Nav />}>
          <Route path="home" element={<Home />} />
          <Route
            path=":npo_url_extension/events"
            element={
              <AuthWrapper>
                <Events />
              </AuthWrapper>
            }
          />
          <Route
            path=":npo_url_extension/events/:eventId"
            element={
              <AuthWrapper>
                <EventPage />
              </AuthWrapper>
            }
          />
          <Route
            path=":npo_url_extension/members"
            element={
              <AuthWrapper>
                <Members />
              </AuthWrapper>
            }
          />
          <Route path=":npo_url_extension/*" element={<Home />} />
          <Route path="public-onboarding" element={<GenericOnboarding />} />
          <Route
            path="individual-onboarding"
            element={<IndividualOnboarding />}
          />
          <Route
            path="corporate-onboarding"
            element={<CorporateOnboarding />}
          />
        </Route>
        <Route path="*" element={<Navigate to="home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
