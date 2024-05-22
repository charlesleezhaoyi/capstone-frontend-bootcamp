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
import { Members } from "./pages/Members";
import { Discussions } from "./pages/Discussions";
import { GenericOnboarding } from "./pages/GenericOnboarding";
import { CorporateOnboarding } from "./pages/CorporateOnboarding";
import { IndividualOnboarding } from "./pages/IndividualOnboarding";
import AuthWrapper from "./components/auth0/AuthWrapper";
import { Home } from "./pages/Home";

function App() {
  const RedirectToEvents = () => {
    let { npoId } = useParams<{ npoId: string }>();
    const navigate = useNavigate();

    if (isNaN(Number(npoId))) {
      npoId = "allNpos";
      navigate(`/${npoId}/events`);
    }

    return null;
  };
  // const RedirectToEvents = () => {
  //   let { npoId } = useParams();
  //   // return <Navigate to={`/${npoId}/events`} replace />;
  // };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Nav />}>
          <Route path=":npoId/*" element={<Home />} />
          <Route path="home" element={<Home />} />
          {/* <Route path=":npoId/" element={<RedirectToEvents />} /> */}
          <Route
            path=":npoId/events"
            element={
              <AuthWrapper>
                <Events />
              </AuthWrapper>
            }
          />
          <Route path="public-onboarding" element={<GenericOnboarding />} />
          <Route
            path="
            individual-onboarding"
            element={<IndividualOnboarding />}
          />
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
