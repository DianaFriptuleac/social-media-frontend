import type { EventListItem, EventCreateOrUpdateBody, EventResponse, EventDetail, EventParticipationResponse, EventParticipationUpdateBody } from "../types/events";
import type { PageResponse } from "../types/profile";
import emptyApi from "./emptyApi";

export const eventApi = emptyApi.injectEndpoints({
    endpoints: (build) => ({
        createEvent: build.mutation<EventResponse, EventCreateOrUpdateBody>({
            query: (body) => ({
                url: "/event",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Events", id: "LIST" }],
        }),
        getAllEvents: build.query<PageResponse<EventListItem>, { page?: number, size?: number }>({
            query: ({ page = 0, size = 10 } = {}) => ({
                url: "/event",
                method: "GET",
                params: { page, size },
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.content.map((e) => ({
                            type: "Events" as const, id: e.id
                        })),
                        { type: "Events" as const, id: "LIST" },
                    ]
                    : [{ type: "Events" as const, id: "LIST" }],
        }),
        getEventById: build.query<EventDetail, string>({
            query: (eventId) => ({
                url: `/event/${eventId}`,
                method: "GET",
            }),
            providesTags: (_res, _err, eventId) => [{ type: "Events", id: eventId }],
        }),
        updateEvent: build.mutation<EventResponse, { eventId: string; body: EventCreateOrUpdateBody }>({
            query: ({ eventId, body }) => ({
                url: `/event/${eventId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_res, _err, arg) => [
                { type: "Events", id: arg.eventId },
                { type: "Events", id: "LIST" },
            ],
        }),
        deleteEvent: build.mutation<void, { eventId: string }>({
            query: ({ eventId }) => ({
                url: `/event/${eventId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_res, _err, arg) => [
                { type: "Events", id: arg.eventId },
                { type: "Events", id: "LIST" },
            ],
        }),

        updateParticipation: build.mutation<
            EventParticipationResponse,
            { eventId: string; body: EventParticipationUpdateBody }
        >({
            query: ({ eventId, body }) => ({
                url: `/event/${eventId}/participation`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_res, _err, arg) => [
                { type: "Events", id: arg.eventId },
                { type: "Events", id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllEventsQuery,
    useGetEventByIdQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useUpdateParticipationMutation,
} = eventApi;