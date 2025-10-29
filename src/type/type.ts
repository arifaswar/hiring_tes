export type CameraCaptureModalProps = {
  onClose: () => void;
  onCapture: (photo: string) => void;
};

export interface FieldConfig {
  key: string;
  label: string;
  state: "mandatory" | "optional" | "off";
}

export interface JobConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (job: any) => void;
};

export type NavbarProps = {
  role: "admin" | "applicant";
};

export type Job = {
  id: string;
  title: string;
  description?: string;
  created_at?: string;
  created_by?: string;
  [key: string]: any;
};

export type JobApp = {
  id?: string;
  title: string;
  company: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  type: string; // Full-Time, Part-Time, dll
  description: string | string[];
};

export type ApplyFormProps = {
  jobId?: string;
  jobTitle: string;
  company: string;
  onBack: () => void;
};

export type Candidate = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  domicile: string;
  gender: string;
  linkedin_link: string;
};

export type ManageCandidatePageProps = {
  job: any;
  onBack: () => void;
};