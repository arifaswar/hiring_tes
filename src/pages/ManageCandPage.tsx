import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Candidate = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  domicile: string;
  gender: string;
  linkedin_link: string;
};

type ManageCandidatePageProps = {
  job: any;
  onBack: () => void;
};

export function ManageCandidatePage({ job, onBack }: ManageCandidatePageProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    setLoading(true);

    const { data: applications, error: appErr } = await supabase
      .from("applications")
      .select("applicant_id, applied_at")
      .eq("job_id", job.id);

    if (appErr) {
      console.error("Error fetching applications:", appErr);
      setLoading(false);
      return;
    }

    if (!applications || applications.length === 0) {
      setCandidates([]);
      setLoading(false);
      return;
    }

    const applicantIds = applications.map((a) => a.applicant_id);

    const { data: profiles, error: profErr } = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, phone_number, date_of_birth, domicile, gender, linkedin_link"
      )
      .in("id", applicantIds);

    if (profErr) {
      console.error("Error fetching profiles:", profErr);
      setLoading(false);
      return;
    }

    const mergedData = profiles.map((p) => ({
      ...p,
      applied_at:
        applications.find((a) => a.applicant_id === p.id)?.applied_at || "",
    }));

    setCandidates(mergedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCandidates();
  }, [job]);

  return (
    <div className="min-h-screen bg-[#fafafa] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {job.title || "Job Title"}
          </h2>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-gray-600 border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-100 transition"
        >
          ← Back to Job List
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
          <p className="italic">Loading candidates...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 py-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png"
            alt="No candidates"
            className="w-56 mb-6 opacity-90"
          />
          <h3 className="text-lg font-semibold text-gray-800">
            No candidates found
          </h3>
          <p className="text-sm text-gray-500 mt-1 text-center max-w-md">
            Share your job vacancies so that more candidates will apply.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-3 px-4 text-left">No</th>
                <th className="py-3 px-4 text-left">Full Name</th>
                <th className="py-3 px-4 text-left">Email Address</th>
                <th className="py-3 px-4 text-left">Phone Number</th>
                <th className="py-3 px-4 text-left">Date of Birth</th>
                <th className="py-3 px-4 text-left">Domicile</th>
                <th className="py-3 px-4 text-left">Gender</th>
                <th className="py-3 px-4 text-left">LinkedIn</th>
                <th className="py-3 px-4 text-left">Applied At</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand, index) => (
                <tr
                  key={cand.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {cand.full_name || "-"}
                  </td>
                  <td className="py-3 px-4">{cand.email || "-"}</td>
                  <td className="py-3 px-4">{cand.phone_number || "-"}</td>
                  <td className="py-3 px-4">
                    {cand.date_of_birth
                      ? new Date(cand.date_of_birth).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-3 px-4">{cand.domicile || "-"}</td>
                  <td className="py-3 px-4">{cand.gender || "-"}</td>
                  <td className="py-3 px-4">
                    {cand.linkedin_link ? (
                      <a
                        href={cand.linkedin_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0077b5] hover:underline"
                      >
                        LinkedIn
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
