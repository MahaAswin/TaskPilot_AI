import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ThemeProvider from './context/ThemeProvider';
import ToastProvider from './context/ToastProvider';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
