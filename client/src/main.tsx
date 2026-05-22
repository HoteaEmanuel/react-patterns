import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";

import "./index.css";
import { ThemeProvider } from "./features/shared/ThemeProvider";

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </React.StrictMode>,
  );
}
