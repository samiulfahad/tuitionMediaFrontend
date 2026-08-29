import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/home";
import BrowseCV from "./pages/browseCV";
import CVEngine from "./pages/cvEngine";

// ─── Main App Component ─────────────────────────────────────────────────────
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/create-cv" element={<CreateCV />} />
      <Route path="/manage-cv" element={<ManageCV />} /> */}
      <Route path="/manage-cv" element={<CVEngine />} />
      <Route path="/create-cv" element={<CVEngine />} />
      <Route path="/find-tutor" element={<BrowseCV />} />
    </Routes>
  );
}

export default App;
