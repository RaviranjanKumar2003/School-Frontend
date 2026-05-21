// ======================================================
// App.jsx
// ======================================================

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Dashboard } from "@/layouts";

import { Auth } from "./layouts/auth";

import ForgotPasswordFlow from
  "./pages/forgotPassword/ForgotPasswordFlow";

import LoginTypeSelection from
  "./pages/auth/LoginTypeSelection";

import SignUpTypeSelection from
  "./pages/auth/SignUpTypeSelection";


import PublicSchoolPage from
  "./pages/public/PublicSchoolPage";

// ======================================================
// APP
// ======================================================

function App() {

  return (

    <Routes>

      {/* ======================================================
          PUBLIC SCHOOL PAGE
          URL =>
          /school/patna-central-school
      ====================================================== */}

      <Route
        path="/school/:slug"
        element={<PublicSchoolPage />}
      />

      {/* ======================================================
          LOGIN PAGE
      ====================================================== */}

      <Route
        path="/"
        element={<LoginTypeSelection />}
      />

      {/* ======================================================
          SIGNUP TYPE PAGE
      ====================================================== */}

      <Route
        path="/auth/sign-up"
        element={<SignUpTypeSelection />}
      />

      {/* ======================================================
          DASHBOARD
      ====================================================== */}

      <Route
        path="/dashboard/*"
        element={<Dashboard />}
      />

      {/* ======================================================
          AUTH PAGES
      ====================================================== */}

      <Route
        path="/auth/*"
        element={<Auth />}
      />

      {/* ======================================================
          FORGOT PASSWORD
      ====================================================== */}

      <Route
        path="/forgot-password"
        element={<ForgotPasswordFlow />}
      />

      {/* ======================================================
          ATTENDANCE
      ====================================================== */}

     

      {/* ======================================================
          NOT FOUND
      ====================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;