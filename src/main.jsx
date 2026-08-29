import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

// Baloo Da 2 — display font
import "@fontsource/baloo-da-2/500.css";
import "@fontsource/baloo-da-2/600.css";
import "@fontsource/baloo-da-2/700.css";
import "@fontsource/baloo-da-2/800.css";

// Hind Siliguri — body font
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "@fontsource/hind-siliguri/700.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Router>
    <App />
  </Router>,
  // </StrictMode>,
);
