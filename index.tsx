
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the root DOM element where the React app will be mounted.
const rootElement = document.getElementById('root');
if (!rootElement) {
  // If the root element isn't found, throw an error to halt execution,
  // as the app cannot be rendered without it.
  throw new Error("Could not find root element to mount to");
}

// Create a root for the React application using React 18's createRoot API.
// This enables concurrent features.
const root = ReactDOM.createRoot(rootElement);

// Render the main App component into the root.
// React.StrictMode is a wrapper that helps identify potential problems in an application.
// It activates additional checks and warnings for its descendants.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
