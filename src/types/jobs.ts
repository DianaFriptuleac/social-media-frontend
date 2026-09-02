import type { User } from "./auth";

//-------- Enums ------------
export type EmploymentType =
    | "FULL_TIME"
    | "PART_TIME"
    | "INTERSHIP"
    | "TEMPORARY";

export type WorkMode =
    | "OFFICE"
    | "HYBRID"
    | "REMOTE";

export type JobStatus =
    | "OPEN"
    | "CLOSED";

export type ApplicationStatus =
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "INTERVIEW"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN";

//---------- Department ------------
export interface JobDepartment {
    id: string;
    name: string;
}

// ------------Jobs ------------------
export interface JobOpening {
    id: string;
    title: string;
    description?: string;
    requirements?: string;
    location?: string;
    employmentType: EmploymentType;
    workMode: WorkMode;
    status: JobStatus;
    applicationDeadline?: string | null;
    department?: JobDepartment | null;
    createdBy?: User | null;
    createdAt: string;

}

// -------- create job ---------
export interface JobCreateBody {
    title: string;
    description: string;
    requirements?: string;
    location?: string;
    employmentType: EmploymentType;
    workMode: WorkMode;
    departmentId: string;
    applicationDeadline?: string | null;
}

// --------- update job ---------
export interface JobUpdateBody {
    title?: string;
    description?: string;
    requirements?: string;
    location?: string;
    employmentType?: EmploymentType;
    workMode?: WorkMode;
    departmentId?: string;
    applicationDeadline?: string | null;
}

// -----------Application -----------
export interface JobApplication {
    id: string;
    job: JobOpening;
    applicant: User;
    cvUrl: string;
    cvPublicId?: string;
    coverLetterText?: string | null;
    coverLetterUrl?: string | null;
    coverLetterPublicId?: string | null;
    status: ApplicationStatus;
    appliedAt: string;
}

// ------------ Apply -----------------
export interface ApplyToJobBody {
    jobId: string;
    cv: File;
    coverLetterText?: string;
    coverLetterFile?: File;
}

//---------- Update application status --------
export interface UpdateApplicationStatusBody {
    applicationId: string;
    status: ApplicationStatus;
}