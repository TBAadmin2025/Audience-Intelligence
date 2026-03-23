import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Report from "./pages/Report.tsx";
import "./index.css";

const pathname = window.location.pathname;
const isReport = pathname.startsWith("/report/");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isReport ? <Report /> : <App />}
  </StrictMode>
);
