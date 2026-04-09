import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              backdropFilter: 'blur(10px)',
              background: 'hsl(var(--card))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '1rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)

