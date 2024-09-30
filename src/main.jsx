import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import ErrorBoundary from './js/pages/Errorboundary.jsx';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
     // console.log('Service Worker registered with scope:', registration.scope);
    }).catch(err => {
     // console.log('Service Worker registration failed:', err);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
       <BrowserRouter>
        <App />
        </BrowserRouter>
    </ErrorBoundary>
    
  </React.StrictMode>,
)


