import React, { useState, useRef } from "react";
import type { JobConfigModalProps } from "../type/type";
import type { FieldConfig } from "../type/type";


export const JobConfigModal: React.FC<JobConfigModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  // ----- Hooks -----
  const [fields, setFields] = useState<FieldConfig[]>([
    { key: "full_name", label: "Full name", state: "mandatory" },
    { key: "photo_profile", label: "Photo Profile", state: "mandatory" },
    { key: "gender", label: "Gender", state: "mandatory" },
    { key: "domicile", label: "Domicile", state: "mandatory" },
    { key: "email", label: "Email", state: "mandatory" },
    { key: "phone_number", label: "Phone number", state: "mandatory" },
    { key: "linkedin_link", label: "LinkedIn link", state: "mandatory" },
    { key: "date_of_birth", label: "Date of birth", state: "mandatory" },
  ]);

  const [jobDescription, setJobDescription] = useState("");
  const [jobType, setJobType] = useState("");
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  // ----- Handlers -----
  const handleToggle = (
    key: string,
    newState: "mandatory" | "optional" | "off"
  ) => {
    setFields((prev) =>
      prev.map((f) => (f.key === key ? { ...f, state: newState } : f))
    );
  };

  const handleJobDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
  };

  const handleJobDescKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const el = descRef.current;
    if (!el) return;

    // ENTER -> sisipkan "\n• " di posisi caret
    if (e.key === "Enter") {
      e.preventDefault();
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const before = jobDescription.slice(0, start);
      const after = jobDescription.slice(end);
      const insert = "\n• ";
      const next = before + insert + after;
      setJobDescription(next);
      requestAnimationFrame(() => {
        el.setSelectionRange(start + 3, start + 3);
      });
    }

    // OPTIONAL: Jika baris pertama tepat di awal dan user menekan Backspace di posisi <= 2,
    // izinkan menghapus bullet awal.
    if (
      jobDescription.length === 0 &&
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      e.preventDefault();
      const next = "• " + e.key;
      setJobDescription(next);
      requestAnimationFrame(() => {
        el.setSelectionRange(3, 3);
      });
    }
  };

  if (!open) return null;

  const handlePublish = () => {
    if (!jobTitle) return alert("Please enter job title!");
    const newJob = {
      id: Date.now(),
      title: jobTitle,
      salaryMin: minSalary || "Rp0",
      salaryMax: maxSalary || "Rp0",
      status: "Draft",
      startDate: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
    onSuccess(newJob);
  };

  // ----- Render -----
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-semibold">Job Opening</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Form Section */}
        <div className="mt-5 space-y-5">
          {/* Job Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Job Name
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter job title"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Job Type
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            >
              <option value="" disabled>
                Select job type
              </option>
              <option value="fulltime">Full-time</option>
              <option value="contract">Contract</option>
              <option value="parttime">Part-time</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              ref={descRef}
              rows={6}
              value={jobDescription}
              onChange={handleJobDescChange}
              onKeyDown={handleJobDescKeyDown}
              placeholder="Type job responsibilities here..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm leading-relaxed focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
            />
            <p className="text-xs text-gray-400 mt-1">
              Press <kbd>Enter</kbd> to add a new bullet point.
            </p>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Expected Salary
              </label>
              <input
                type="text"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="Rp 7.000.000"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Expected Salary
              </label>
              <input
                type="text"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                placeholder="Rp 8.000.000"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Minimum Profile Info Required */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Minimum Profile Information Required
            </h3>

            <div className="space-y-2">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center justify-between border-b py-2 text-sm"
                >
                  <span className="text-gray-700">{field.label}</span>
                  <div className="flex gap-2">
                    {(["mandatory", "optional", "off"] as const).map(
                      (state) => (
                        <button
                          key={state}
                          onClick={() => handleToggle(field.key, state)}
                          className={`rounded-full border px-3 py-0.5 text-xs font-medium transition ${
                            field.state === state
                              ? state === "mandatory"
                                ? "bg-white text-[#24a4ac] border-[#24a4ac]"
                                : state === "optional"
                                ? "bg-white text-[#24a4ac] border-[#24a4ac]"
                                : "bg-white text-[#24a4ac] border-[#24a4ac]"
                              : "border-gray-400 text-gray-400 hover:border-gray-300"
                          }`}
                        >
                          {state === "mandatory"
                            ? "Mandatory"
                            : state === "optional"
                            ? "Optional"
                            : "Off"}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t pt-4">
          <button
            onClick={handlePublish}
            className="rounded-lg bg-[#24a4ac] px-5 py-2.5 text-white hover:brightness-95"
          >
            Publish Job
          </button>
        </div>
      </div>
    </div>
  );
};
