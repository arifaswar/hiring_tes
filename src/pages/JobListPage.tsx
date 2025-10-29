type Job = {
  title: string;
  salaryMin?: number | string;
  salaryMax?: number | string;
  startDate?: string;
  status?: "Active" | "Inactive" | "Draft";
};

export const JobListPage = ({
  jobs,
  onManageJob,
}: {
  jobs: Job[];
  onManageJob: (job: Job) => void;
}) => {
  return (
    <div className="px-8 py-4 space-y-4 w-10/12">
      {jobs.map((job, index) => {
        // 💡 Tentukan warna status berdasarkan nilai job.status
        const statusColor =
          job.status === "Active"
            ? "bg-green-100 text-green-600"
            : job.status === "Inactive"
            ? "bg-red-100 text-red-600"
            : "bg-yellow-100 text-yellow-600"; // default untuk Draft

        return (
          <div
            key={index}
            className="flex justify-between items-center rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center gap-4">
                {/* Badge status dinamis */}
                <span className={`text-xs px-2 py-1 rounded-lg ${statusColor}`}>
                  {job.status || "Draft"}
                </span>

                {/* Tanggal mulai */}
                <p className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-md">
                  started on {job.startDate || "Today"}
                </p>
              </div>

              {/* Nama dan gaji */}
              <h3 className="font-medium mt-2 text-gray-800">{job.title}</h3>
              <p className="text-sm text-gray-500 py-2">
                {job.salaryMin} - {job.salaryMax}
              </p>
            </div>

            {/* Tombol Manage */}
            <button
              onClick={() => onManageJob(job)}
              className="rounded-lg bg-[#00B2A9] text-white px-4 py-1.5 text-sm hover:brightness-95"
            >
              Manage Job
            </button>
          </div>
        );
      })}
    </div>
  );
};
