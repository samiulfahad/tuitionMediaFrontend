import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout";
import HomePage from "./pages/home";
import BrowseCV from "./pages/browseCV";
import CVEngine from "./pages/cvEngine";

// ─── Main App Component ─────────────────────────────────────────────────────
// Every route is wrapped in <Layout>, which renders the shared Header and
// Footer around the page content — so Header/Footer stay in sync across
// the whole site instead of being duplicated per page.
function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/manage-cv"
        element={
          <Layout>
            <CVEngine />
          </Layout>
        }
      />
      <Route
        path="/create-cv"
        element={
          <Layout>
            <CVEngine />
          </Layout>
        }
      />
      <Route
        path="/find-tutor"
        element={
          <Layout>
            <BrowseCV />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
