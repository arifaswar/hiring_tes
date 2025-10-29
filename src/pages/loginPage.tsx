import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function LoginPage() {
//   const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) setMessage(`❌ ${error.message}`);
    else setMessage("✅ Magic link dikirim ke email kamu!");
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) alert(error.message);
  };

// Role-based navigation should be handled in the auth callback after determining the user's role.
// Removed usage of undefined `userRole` and `navigate` from this component.

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 w-[360px]">
        <h1 className="text-xl font-semibold text-gray-800 text-center">
          Masuk ke Rakamin
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Belum punya akun?{" "}
          <Link to="/register" className="text-[#00B2A9]">Daftar</Link>
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Alamat email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#00B2A9]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFC107] text-black py-2 rounded-md font-medium hover:brightness-95"
          >
            {loading ? "Mengirim link..." : "Masuk dengan email"}
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-400">atau</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 py-2 rounded-md hover:bg-gray-50"
          >
            Masuk dengan Google
          </button>
        </form>

        {message && (
          <p className="text-sm text-center mt-4 text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}
