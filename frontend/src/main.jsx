import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './index.css';
import { SocketContextProvider } from './context/SocketContext.jsx';
import 'react-toastify/dist/ReactToastify.css';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <StrictMode>
    <Router>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
      <ToastContainer position='bottom-left' />
      {/* <ToastContainer /> */}
    </Router>
  </StrictMode>
);
