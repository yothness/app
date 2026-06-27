import "./app.polyfill";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Application";

const root = document.querySelector<HTMLElement>("#application")
if (root) {
  ReactDOM.createRoot(root).render(<App application_={(window as any).app ??= {}} root_={root} />)
} else console.error("`#application` don't exits ")
