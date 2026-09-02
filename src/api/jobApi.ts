import emptyApi from "./emptyApi";

import type { PageResponse } from "../types/page";

import type {
    JobOpening,
    JobCreateBody,
    JobUpdateBody,
    JobApplication,
    ApplyToJobBody,
    UpdateApplicationStatusBody,
} from "../types/jobs";

export const jobApi = emptyApi.injectEndpoints({
    endpoints: (build) => ({

        // --------- Get open jobs
        getJobs: build.query<
            PageResponse<JobOpening>,
            { page?: number; size?: number }
        >({
            query: ({ page = 0, size = 10 } = {}) => ({
                url: "/jobs",
                method: "GET",
                params: {
                    page,
                    size,
                },
            }),

            providesTags: (result) =>
                result
                    ? [
                        ...result.content.map((job) => ({
                            type: "Jobs" as const,
                            id: job.id,
                        })),
                        {
                            type: "Jobs" as const,
                            id: "LIST",
                        },
                    ]
                    : [
                        {
                            type: "Jobs" as const,
                            id: "LIST",
                        },
                    ],
        }),

        // ----------- Get job by id
        getJobById: build.query<JobOpening, string>({
            query: (jobId) => ({
                url: `/jobs/${jobId}`,
                method: "GET",
            }),

            providesTags: (_result, _error, jobId) => [
                {
                    type: "Jobs",
                    id: jobId,
                },
            ],
        }),

        // --------------- create job
        createJob: build.mutation<JobOpening, JobCreateBody>({
            query: (body) => ({
                url: "/jobs",
                method: "POST",
                body,
            }),

            invalidatesTags: [
                {
                    type: "Jobs", id: "LIST",
                },
            ],
        }),

        // ------------- update job
        updateJob: build.mutation<JobOpening, { jobId: string; body: JobUpdateBody }>({
            query: ({ jobId, body }) => ({
                url: `/jobs/${jobId}`,
                method: "PUT",
                body,
            }),

            invalidatesTags: (_result, _error, { jobId }) => [
                { type: "Jobs", id: jobId, },
                { type: "Jobs", id: "LIST", },
            ],
        }),

        // -------------- close job
        closeJob: build.mutation<JobOpening, string>({
            query: (jobId) => ({
                url: `/jobs/${jobId}/close`,
                method: "PATCH",
            }),

            invalidatesTags: (_result, _error, jobId) => [
                { type: "Jobs", id: jobId, },
                { type: "Jobs", id: "LIST", },
            ],
        }),

        // ----------- delete job
        deleteJob: build.mutation<void, string>({
            query: (jobId) => ({
                url: `/jobs/${jobId}`,
                method: "DELETE",
            }),

            invalidatesTags: (_result, _error, jobId) => [
                { type: "Jobs", id: jobId, },
                { type: "Jobs", id: "LIST", },
            ],
        }),


        // -------------- apply to job
        applyToJob: build.mutation<JobApplication, ApplyToJobBody>({
            query: ({ jobId, cv, coverLetterText, coverLetterFile, }) => {
                const formData = new FormData();
                formData.append("cv", cv);

                // cover letter opzionale
                if (coverLetterText) {
                    formData.append("covverLetterText", coverLetterText);
                }
                if (coverLetterFile) {
                    formData.append("covverLetterFile", coverLetterFile);
                }
                return {
                    url: `/job_applications/jobs/${jobId}/apply`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: [{ type: "MyJobApplications", id: "LIST", },],
        }),

        // ------------- get my applications
        getMyApplications: build.query<PageResponse<JobApplication>, { page?: number; size?: number }>({
            query: ({ page = 0, size = 10 } = {}) => ({
                url: "job_applications/me",
                method: "GET",
                params: { page, size, },
            }),
            providesTags: (result) => result ? [
                ...result.content.map((application) => ({
                    type: "MyJobApplications" as const, id: application.id,
                })),
                { type: "MyJobApplications" as const, id: "LIST", },
            ] : [
                { type: "MyJobApplications" as const, id: "LIST", },
            ],
        }),

        // ---------- withdraw application
        withdrawApplication: build.mutation<JobApplication, string>({
            query: (applicationId) => ({
                url: `/job_applications/${applicationId}/withdraw`,
                method: "PATCH",
            }),
            invalidatesTags: (_result, _error, applicationId) => [
                { type: "MyJobApplications", id: applicationId, },
                { type: "MyJobApplications", id: "LIST", },
            ],
        }),

        // ------------- get application by job
        getApplicationsByJob: build.query<PageResponse<JobApplication>, {
            jobId: string; page?: number; size?: number;
        }>({
            query: ({ jobId, page = 0, size = 10, }) => ({
                url: `/job_applications/jobs/${jobId}`,
                method: "GET",
                params: { page, size, },
            }),
            providesTags: (result, _error, { jobId }) =>
                result
                    ? [...result.content.map((application) => ({
                        type: "JobApplications" as const, id: application.id,
                    })),
                    {
                        type: "JobApplications" as const, id: jobId,
                    },
                    ] : [
                        {
                            type: "JobApplications" as const, id: jobId,
                        },
                    ],
        }),

        //--------------------- applications count
        getApplicationsCount: build.query<number, string>({
            query: (jobId) => ({
                url: `/job_applications/jobs/${jobId}/count`,
                method: "GET",
            }),
            providesTags: (_result, _error, jobId) => [
                {
                    type: "JobApplications", id: jobId,
                },
            ],
        }),

        // ------------ update application status
        updateApplicationStatus: build.mutation<JobApplication, UpdateApplicationStatusBody>({
            query: ({ applicationId, status, }) => ({
                url: `/job_applications/${applicationId}/status`,
                method: "PATCH",
                body: { status, },
            }),

            invalidatesTags: (_result, _error, { applicationId }) => [
                {
                    type: "JobApplications", id: applicationId,
                },
                {
                    type: "JobApplications", id: "LIST",
                },
                {
                    type: "MyJobApplications", id: "LIST",
                },
            ],
        }),

    }),

    overrideExisting: false,
});

export const {
    // Jobs
    useGetJobsQuery,
    useGetJobByIdQuery,
    useCreateJobMutation,
    useUpdateJobMutation,
    useCloseJobMutation,
    useDeleteJobMutation,

    useApplyToJobMutation,
    useGetMyApplicationsQuery,
    useWithdrawApplicationMutation,

    useGetApplicationsByJobQuery,
    useGetApplicationsCountQuery,
    useUpdateApplicationStatusMutation,
} = jobApi;