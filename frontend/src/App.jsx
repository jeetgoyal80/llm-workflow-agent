import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './Pages/Landing';
import Contacts from './Pages/Contacts';
import AppDashboard from './Pages/AppDashboard';
import Todos from './Pages/Todos';
import Settings from './Pages/Settings';
import Login from './Pages/Login';
import Reminders from './Pages/Reminders'; // ✅ Make sure this exists
import Navbar from './components/Navbar';


import { ToastContainer } from "react-toastify";
import Register from './Pages/Register';
import EmailVerified from './Pages/EmailVerified';
import VerifyEmail from './Pages/VerifyEmail';

function App() {
  return (
  <>     
<ToastContainer
  position="bottom-right"
  autoClose={3000}
  limit={3}
  theme="dark"
/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppDashboard />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/email-verified" element={<EmailVerified />} />
      </Routes>
    </>
  );
}

export default App;
