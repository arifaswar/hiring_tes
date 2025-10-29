import { useEffect } from "react";

type Props = {
  onBack: () => void;
};

export default function ApplicationSuccessPage({ onBack }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => onBack(), 5000); // otomatis balik setelah 5 detik
    return () => clearTimeout(timer);
  }, [onBack]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 px-4">
      {/* 🎨 SVG Ilustrasi */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 300"
        className="w-64 mb-6"
      >
        <circle cx="200" cy="150" r="80" fill="#E6F7F6" />
        <path
          d="M180 150 l25 25 50 -50"
          stroke="#00B2A9"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="180" cy="150" r="70" stroke="#00B2A9" strokeWidth="3" fill="none" />
      </svg>

      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        🎉 Your application was sent!
      </h1>
      <p className="text-gray-600 max-w-md">
        Congratulations! You've taken the first step towards a rewarding career at Rakamin.
        <br />
        We look forward to learning more about you during the application process.
      </p>

      <button
        onClick={onBack}
        className="mt-6 bg-[#00B2A9] text-white px-6 py-2 rounded-md font-semibold hover:brightness-95"
      >
        Back to Job List
      </button>
    </div>
  );
}
