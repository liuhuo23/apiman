import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Ant Design reset and ConfigProvider theme integration
import 'antd/dist/reset.css';
import ThemeProvider from './styles/theme-provider';
import './styles/antd-vars.css';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
