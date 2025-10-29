import { useState, useEffect } from "react";
import ApplyFormPage from "./applyFormPage";
import { Navbar } from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";

type Job = {
  id?: string;
  title: string;
  company: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  type: string; // Full-Time, Part-Time, dll
  description: string | string[];
};

export default function ApplicantPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching jobs:", error);
    else setJobs(data || []);

    setLoading(false);
  };

  const fetchAppliedJobs = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("applications")
      .select("job_id")
      .eq("applicant_id", user.id);

    if (error) console.error("Error fetching applied jobs:", error);
    else setAppliedJobs(data?.map((a) => a.job_id) || []);
  };

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  // Safely compute whether the selected job has been applied to
  const isApplied = selectedJob?.id
    ? appliedJobs.includes(selectedJob.id)
    : false;

const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setShowForm(true);
  };
  

  if (showForm && selectedJob) {
    return (
      <ApplyFormPage
        jobId={selectedJob.id}
        jobTitle={selectedJob.title}
        company={selectedJob.company}
        onBack={() => setShowForm(false)}
      />
    );
  }

  return (
    <div>
      <Navbar role="applicant" />
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar kiri: list job */}
        <div className="w-1/3 pr-4 space-y-3 p-6">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-500 italic">
              Belum ada pekerjaan tersedia.
            </p>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`cursor-pointer border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition ${
                  selectedJob?.id === job.id
                    ? "border-[#00B2A9]"
                    : "border-gray-200"
                }`}
              >
                <h3 className="font-semibold text-gray-800">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.company}</p>
                <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
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
                      d="M17.657 16.657L13.414 12.414a2 2 0 10-2.828 2.828l4.243 4.243a8 8 0 111.172-1.172z"
                    />
                  </svg>
                  {job.location}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {job.salaryMin} - {job.salaryMax}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Panel kanan: detail job */}
        <div className="w-2/3 bg-white rounded-lg p-6 shadow-sm">
          {selectedJob ? (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md">
                    {selectedJob.type}
                  </span>
                  <h2 className="text-lg font-semibold mt-2">
                    {selectedJob.title}
                  </h2>
                  <p className="text-gray-600">{selectedJob.company}</p>
                </div>
                <button
                  onClick={() => handleApplyClick(selectedJob)}
                  disabled={isApplied}
                  className={`text-sm px-4 py-2 rounded-md transition ${
                    isApplied
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-[#FFA500] text-white hover:brightness-95"
                  }`}
                >
                  {isApplied ? "Sudah Dilamar" : "Apply"}
                </button>
              </div>

              <ul className="list-disc ml-5 mt-4 space-y-2 text-sm text-gray-700">
                {Array.isArray(selectedJob.description) ? (
                  selectedJob.description.map((desc: string, i: number) => (
                    <li key={i}>{desc}</li>
                  ))
                ) : typeof selectedJob.description === "string" ? (
                  selectedJob.description
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .map((desc: string, i: number) => <li key={i}>{desc}</li>)
                ) : (
                  <li className="text-gray-400 italic">
                    No description available
                  </li>
                )}
              </ul>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 italic">
              Select a job to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
