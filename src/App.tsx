import { useState } from "react";
import { Navbar } from "./components/Navbar";
import AdminPage from "./pages/adminPage";
import ApplicantPage from "./pages/applicantPage";

export default function App() {
  const [role, setRole] = useState<"admin" | "applicant">("applicant");

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-end mt-4">
        <button
          onClick={() =>
            setRole(role === "admin" ? "applicant" : "admin")
          }
          className="text-xs border px-3 py-1 rounded-md hover:bg-gray-50 transition"
        >
          Switch to {role === "admin" ? "Applicant" : "Admin"}
        </button>
      </div>

      {role === "admin" ? <AdminPage /> : <ApplicantPage />}
    </div>
  );
}
