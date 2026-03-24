import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Report from "./pages/Report.tsx";
import Schedule from "./pages/Schedule.tsx";
import "./index.css";
import { getThemeVars } from "./styles/theme";
import { diagnosticConfig } from "./client/config";

// Apply theme CSS custom properties to root element
const themeVars = getThemeVars(diagnosticConfig.brand.vibe);
const root = document.documentElement;
Object.entries(themeVars).forEach(([key, value]) => {
  root.style.setProperty(key, value);
});

const pathname = window.location.pathname;

const getPage = () => {
  if (pathname.startsWith("/report/")) return <Report />;
  if (pathname === "/schedule") return <Schedule />;
  return <App />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {getPage()}
  </StrictMode>
);
