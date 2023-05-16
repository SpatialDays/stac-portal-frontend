// React
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// App
import App from "./App";

// Auth
import { auth } from "auth/auth";

// Styles
import './index.scss';

auth();

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
