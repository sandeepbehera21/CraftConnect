import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'   // ✅ Important
import { AuthProvider } from './state/AuthContext.jsx'
import { ToastProvider } from './ui/ToastProvider.jsx'
import { CartProvider } from './state/CartContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
