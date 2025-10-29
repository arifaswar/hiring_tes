import { useState, useEffect } from "react";
import { FloatingCTA } from "../components/FloatingCTA";
import { JobConfigModal } from "../components/JobConfigModal";
import { JobListPage } from "./JobListPage";
import { ManageCandidatePage } from "./ManageCandPage";
import { Navbar } from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";

type Job = {
  id: string;
  title: string;
  description?: string;
  created_at?: string;
  created_by?: string;
  [key: string]: any;
};

export default function AdminPage() {
  const [openModal, setOpenModal] = useState(false);
  const [jobList, setJobList] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error);
    } else {
      setJobList(data || []);
    }
    setLoading(false);
  };

  const handleJobCreated = async (newJob: Job) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("Anda harus login untuk membuat job.");
      return;
    }

    const { data, error } = await supabase
      .from("jobs")
      .insert([
        {
          title: newJob.title,
          description: newJob.description,
          created_by: user.id,
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("Error creating job:", error);
      alert("Gagal membuat job!");
    } else {
      setJobList((prev) => [data, ...prev]);
      setOpenModal(false);
    }
  };

  const handleManageJob = (job: Job) => {
    setSelectedJob(job); // pindah ke halaman manage kandidat
  };

  const handleBackToList = () => {
    setSelectedJob(null); // kembali ke daftar job
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Navbar role="admin" />
      {!selectedJob ? (
        <>
          <div className="px-8 py-5">
            <div className="relative w-10/12">
              <input
                type="text"
                placeholder="Search by job details"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          <FloatingCTA onClick={() => setOpenModal(true)} />

          {loading ? (
            <div className="flex flex-1 justify-center items-center text-gray-500">
              Loading job list...
            </div>
          ) : jobList.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png"
                alt="Empty Jobs"
                className="w-60 mb-6"
              />
              <h2 className="text-lg font-semibold text-gray-800">
                No job openings available
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Create a job opening now and start the candidate process.
              </p>
              <button
                onClick={() => setOpenModal(true)}
                className="mt-5 rounded-lg bg-[#FFC107] px-5 py-2.5 text-black hover:brightness-95 transition"
              >
                Create a new job
              </button>
            </div>
          ) : (
            <JobListPage jobs={jobList} onManageJob={(job: any) => handleManageJob(job)} />
          )}

          <JobConfigModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSuccess={handleJobCreated}
          />
        </>
      ) : (
        <ManageCandidatePage job={selectedJob} onBack={handleBackToList} />
      )}
    </div>
  );
}
