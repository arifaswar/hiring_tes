import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setMessage("");
    setLoading(true);

    // Cek apakah email sudah terdaftar di Supabase
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      setErrorMessage(
        "Email ini sudah terdaftar sebagai akun di Rakamin Academy. Masuk"
      );
      setLoading(false);
      return;
    }



    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        setErrorMessage(
          "Email ini sudah terdaftar sebagai akun di Rakamin Academy. Masuk"
        );
      } else {
        setErrorMessage(error.message);
      }
    } else {
      setSuccessMessage("✅ Magic link telah dikirim ke email kamu!");
      setTimeout(() => navigate(`/verify-email?email=${encodeURIComponent(email)}`), 100);
    }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setErrorMessage(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 w-[360px]">
        <h1 className="text-xl font-semibold text-gray-800 text-center">
          Bergabung dengan Rakamin
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-[#00B2A9]">Masuk</Link>

        </p>

        <form onSubmit={handleRegister} className="space-y-3">
          {errorMessage && (
            <div className="bg-red-50 border border-red-400 text-red-600 px-3 py-2 rounded text-sm text-center">
              {errorMessage.includes("Masuk") ? (
                <>
                  Email ini sudah terdaftar sebagai akun di Rakamin Academy.{" "}
                  <a
                    href="/login"
                    className="font-medium underline text-[#00B2A9]"
                  >
                    Masuk
                  </a>
                </>
              ) : (
                errorMessage
              )}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-400 text-green-600 px-3 py-2 rounded text-sm text-center">
              {successMessage}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat email
            </label>
            <input
              type="email"
              required
              placeholder="contoh@rakamin.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#00B2A9] focus:border-[#00B2A9]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFC107] text-black py-2 rounded-md font-semibold hover:brightness-95"
          >
            {loading ? "Mengirim link..." : "Daftar dengan email"}
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
            onClick={handleGoogle}
            className="w-full border border-gray-300 py-2 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Daftar dengan Google
          </button>
        </form>

        {message && (
          <p className="text-sm text-center mt-4 text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}
