import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Report from "./pages/Report.tsx";
import Schedule from "./pages/Schedule.tsx";
import "./index.css";

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
