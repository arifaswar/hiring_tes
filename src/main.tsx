import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import RegisterPage from "./pages/registerPage";
import LoginPage from "./pages/loginPage";
import AuthCallback from "./pages/authCallback";
import "./index.css";
import AdminPage from "./pages/adminPage";
import ApplicantPage from "./pages/applicantPage";
import { JobListPage } from "./pages/JobListPage";
import { ManageCandidatePage } from "./pages/ManageCandPage";
import EmailVerification from "./pages/emailVerification";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/applicant" element={<ApplicantPage />} />
        <Route path="/joblist" element={<JobListPage jobs={[]} onManageJob={() => {}} />} />
        <Route path="/manageCandidate" element={<ManageCandidatePage job={{}} onBack={() => {}} />} />
        <Route path="/verify-email" element={<EmailVerification />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
