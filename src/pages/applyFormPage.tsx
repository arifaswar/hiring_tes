import { useState } from "react";
import CameraCaptureModal from "../components/CameraCaptureModal";
import { supabase } from "../lib/supabaseClient";
import ApplicationSuccessPage from "./applicationSuccessPage";

type ApplyFormProps = {
  jobId?: string;
  jobTitle: string;
  company: string;
  onBack: () => void;
};

export default function ApplyFormPage({
  jobId,
  jobTitle,
  onBack,
}: ApplyFormProps) {
  const [photo, setPhoto] = useState<string>("");
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    gender: "",
    domicile: "",
    phone: "",
    email: "",
    linkedin: "",
    photo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    // 🔹 Simpan profil applicant
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email,
        full_name: formData.fullName,
        date_of_birth: formData.birthDate,
        gender: formData.gender,
        domicile: formData.domicile,
        phone_number: formData.phone,
        linkedin_link: formData.linkedin
      },
      { onConflict: "id" }
    );

    if (profileError) {
      console.error("Error saving profile:", profileError);
      alert("Gagal menyimpan profil.");
      setLoading(false);
      return;
    }

    // 🔹 Simpan lamaran
    const { error: applyError } = await supabase.from("applications").insert([
      {
        job_id: jobId,
        applicant_id: user.id,
        applicant_email: user.email,
      },
    ]);

    if (applyError) {
      console.error("Error saving application:", applyError);
      alert("Gagal melamar pekerjaan.");
      setLoading(false);
    } else {
      setSuccess(true); // ✅ tampilkan halaman sukses
    }
  };

  if (success) {
    return <ApplicationSuccessPage onBack={onBack} />;
  }

  return (
    <div className="w-6/12 mx-auto bg-white rounded-lg shadow-md mt-8 mb-10 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center border-b px-5 py-3">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="hover:opacity-80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h2 className="text-[15px] font-semibold text-gray-800">
            Apply {jobTitle}
          </h2>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          This field required to fill
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
        <p className="text-sm text-red-500 font-medium">* Required</p>

        {/* Photo */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={
              photo || "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            }
            className="w-20 h-20 rounded-full object-cover border border-gray-300"
          />
          <button
            onClick={() => setShowCamera(true)}
            className="border border-gray-300 px-3 py-1.5 text-sm rounded-md hover:bg-gray-50 flex items-center gap-2"
          >
            📷 Take a Picture
          </button>
        </div>

        {showCamera && (
          <CameraCaptureModal
            onClose={() => setShowCamera(false)}
            onCapture={(img) => {
              setPhoto(img);
              setShowCamera(false);
            }}
          />
        )}

        {/* Full name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full name<span className="text-red-500">*</span>
          </label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:ring-1 focus:ring-[#00B2A9] outline-none"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of birth<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#00B2A9] outline-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10m-9 4h10m-9 4h10m-7 4h4a2 2 0 002-2V7a2 2 0 00-2-2h-4"
              />
            </svg>
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pronoun (gender)<span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 mt-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
              />
              She/her (Female)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
              />
              He/him (Male)
            </label>
          </div>
        </div>

        {/* Domicile */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Domicile<span className="text-red-500">*</span>
          </label>
          <select
            name="domicile"
            value={formData.domicile}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-[#00B2A9] outline-none"
          >
            <option value="">Choose your domicile</option>
            <option value="Jakarta">Jakarta</option>
            <option value="Bandung">Bandung</option>
            <option value="Surabaya">Surabaya</option>
            <option value="Yogyakarta">Yogyakarta</option>
          </select>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone number<span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mt-1">
            <span className="border border-gray-300 rounded-md px-2 py-2 text-sm bg-gray-50">
              🇮🇩 +62
            </span>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="81XXXXXXXXX"
              required
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:ring-1 focus:ring-[#00B2A9] outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:ring-1 focus:ring-[#00B2A9] outline-none"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Link LinkedIn<span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:ring-1 focus:ring-[#00B2A9] outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-[#00B2A9] text-white font-medium py-2 rounded-md hover:brightness-95"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
