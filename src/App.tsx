import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { Nav } from "./components/nav-overlay/NavOverlay";
import { Events } from "./pages/Events";
import { Members } from "./pages/Members";
import { Discussions } from "./pages/Discussions";
import { GenericOnboarding } from "./pages/GenericOnboarding";
import { CorporateOnboarding } from "./pages/CorporateOnboarding";
import { IndividualOnboarding } from "./pages/IndividualOnboarding";
import { useContext } from "react";
import AuthWrapper from "./components/auth0/AuthWrapper";
import { Home } from "./pages/Home";

function App() {
  const RedirectToEvents = () => {
    let { npoId } = useParams();
    return <Navigate to={`/${npoId}/events`} replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Nav />}>
          <Route path="home" element={<Home />} />
          <Route path=":npoId/" element={<RedirectToEvents />} />
          <Route path=":npoId/events" element={<Events />} />
          <Route path="public-onboarding" element={<GenericOnboarding />} />
          <Route
            path="/individual-onboarding"
            element={<IndividualOnboarding />}
          />
          {/* <Route
            path="/individual-onboarding/continue"
            element={<IndividualOnboarding />}
          /> */}
          <Route
            path="corporate-onboarding"
            element={<CorporateOnboarding />}
          />

          <Route path="members" element={<Members />} />
          <Route path="discussions" element={<Discussions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
