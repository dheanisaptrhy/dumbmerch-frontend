import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import App from './App';
import { UserContextProvider } from './context/UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';

// query client => untuk configurasi react query
const root = ReactDOM.createRoot(document.getElementById('root'));
const client = new QueryClient();
// inisiasi dari QueryClient
// untuk menampung perintah2 yg dikirim dari pengguna

root.render(
  <React.StrictMode>
    <UserContextProvider>
      <QueryClientProvider client={client}>
        {/* membawa value dari QueryClient */}
        <Router>
          <App />
        </Router>
      </QueryClientProvider>
    </UserContextProvider>
  </React.StrictMode>
);

