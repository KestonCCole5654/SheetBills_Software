import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './components/context/AuthContext';
import IntegrationPage from './components/sheetIntegration';
import RootLayout from './components/layout';
import Dashboard from './components/dashboard';
import CreateInvoice from './pages/createInvoice/page';
import Login from './components/Auth/login/loginPage';
import Registration from './components/Auth/register/registerPage';
import './App.css';
import './global.css';
import './index.css';

function App() {
  // Replace with your actual Google Client ID
  const GOOGLE_CLIENT_ID = "690352345014-f6109esk8obn8kvntf7ggnnf5ghbonu2.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <HelmetProvider>
          <Router>
            <RootLayout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/createInvoices/page" element={<CreateInvoice />} />
                {/* Add other routes here */}
                <Route path="/invoices" element={<Dashboard />} /> {/* Placeholder - update with actual component */}
                <Route path="/customers" element={<Dashboard />} /> {/* Placeholder - update with actual component */}
                <Route path="/integration" element={<IntegrationPage />} /> {/* Placeholder - update with actual component */}
                <Route path="/terms" element={<Dashboard />} /> {/* Placeholder - update with actual component */}
              </Routes>
            </RootLayout>
          </Router>
        </HelmetProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;