// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // <-- Yeh add karo

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- Yeh add karo */}
      <App />
    </BrowserRouter> {/* <-- Yeh add karo */}
  </React.StrictMode>
);