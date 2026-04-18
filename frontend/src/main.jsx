import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LangProvider } from './context/LangContext.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </LangProvider>
  </React.StrictMode>,
)
