import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/login");
        return;
      }

      const role = data.user.user_metadata?.role || "applicant";
      navigate(role === "admin" ? "/admin" : "/applicant");
    };

    handleSession();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-700">
      Memverifikasi akun kamu...
    </div>
  );
}
