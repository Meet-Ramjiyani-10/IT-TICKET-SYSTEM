import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter added here so routing works across the app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
