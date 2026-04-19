import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LangProvider } from './context/LangContext.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './mockBackend.js'; 

// Global Error Handler for faster debugging
window.onerror = (msg, url, line, col, error) => {
  console.error("--- GLOBAL APP ERROR ---");
  console.error(msg, "\nURL:", url, "\nLine:", line, "Col:", col);
  if (error) console.error(error);
  return false;
};

console.log("P95.AI Platform Initializing...");

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LangProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </LangProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
