import { useLocation } from "react-router-dom";

export default function EmailVerification() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get("email");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-10 w-[480px] text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">
          Periksa Email Anda
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Kami sudah mengirimkan link register ke{" "}
          <span className="font-medium text-gray-900">{email}</span> yang berlaku
          dalam <span className="font-semibold text-gray-800">30 menit</span>.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3176/3176366.png"
          alt="Mail Illustration"
          className="w-48 mx-auto mb-6"
        />

        <p className="text-sm text-gray-400">
          Belum menerima email? Periksa folder spam atau{" "}
          <a href="/register" className="text-[#00B2A9] hover:underline">
            coba lagi
          </a>
          .
        </p>
      </div>
    </div>
  );
}
