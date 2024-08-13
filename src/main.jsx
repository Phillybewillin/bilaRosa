import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import './App.scss';
import ErrorBoundary from './js/pages/Errorboundary.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
       <BrowserRouter>
        <App />
        </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
