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

// aggiungo nuovi endpoind alla emptyApi
export const jobApi = emptyApi.injectEndpoints({

    // Definisce tutti gli endpoint relativi ai jobs
    endpoints: (build) => ({

        // --------- Get open jobs
        getJobs: build.query<

            // Tipo risposta BE - pagina con oggetti JobOpening
            PageResponse<JobOpening>,

            // Tipo argomento da passare alla query (in questo caso page e size sono opzionali)
            { page?: number; size?: number }
        >({

            //Richiesta HTTP da effettuare
            query: ({ page = 0, size = 10 } = {}) => ({
                url: "/jobs",
                method: "GET",
                params: {
                    page,
                    size,
                },
            }),

            // Tag associati ai dati restituiti dalla query
            // RTK Query usa questi tag per sapere quali dati
            // devono essere aggiornati/refetchati dopo una mutation
            providesTags: (result) =>
                // controlla se BE ha restituito un risultato
                result
                    ? [
                        // Prende tutti i jobs presenti nella pagina e crea un tag specifico per ogni job
                        ...result.content.map((job) => ({
                            // Tipo di tag
                            type: "Jobs" as const,
                            // Id specifico del job
                            id: job.id,
                        })),
                        // Aggiunge un tag genmerare per l'intera lista
                        {
                            type: "Jobs" as const,
                            // LIST - tutta la lista dei jobs
                            id: "LIST",
                        },
                    ]
                    // Se result non esiste non crea i tag dei singoli jobs, ma mantiene il tag generale della lista
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
        createJob: build.mutation
            // Tipo della risposta dal BE (dopo la creazione, il BE restituisce il JobOpening creato)
            <JobOpening,
                // Tipo dati da inviare al BE
                JobCreateBody>({

                    // body - contiene i dati ricevuti quando chiamo createJob(...)
                    query: (body) => ({
                        url: "/jobs",
                        method: "POST",
                        body,
                    }),

                    // Indica a RTK Query quali dati presenti nella cache
                    invalidatesTags: [
                        {
                            // Tipo cache che inviamo
                            type: "Jobs",
                            // LIST - lista completa dei jobs 
                            id: "LIST",
                        },
                    ],
                }),

        // ------------- update job
        updateJob: build.mutation<JobOpening,
            // Tipo dati da passare alla mutation:
            // - jobId - ID del job da modificare
            // - body  - nuovi dati del job
            { jobId: string; body: JobUpdateBody }>({

                query: ({ jobId, body }) => ({
                    url: `/jobs/${jobId}`,
                    method: "PUT",
                    body,
                }),

                // indica a RTK Query quali dati nella cache non sono più considerati aggiornati
                invalidatesTags:
                    // Risultato restituito dalla mutation - non serve qui quindi utilizzo _result
                    (_result,
                        // Eventuale error - non serve, utilizzo _error
                        _error,
                        // Terzo parametro = argomento passato alla mutation - da questo recupero jobId
                        { jobId }) => [

                            // Invalida la cache dello specifico job modificato
                            {
                                type: "Jobs",
                                // ID del job appena aggiornato
                                id: jobId,
                            },

                            // Invalida anche la cache generale dei Jobs
                            {
                                type: "Jobs",
                                id: "LIST",
                            },
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