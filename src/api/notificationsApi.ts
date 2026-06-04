import type { NotificationDTO } from "../types/notifications";
import emptyApi from "./emptyApi";

export const notificationsApi = emptyApi.injectEndpoints({
    endpoints: (build) => ({
        getMyNotifications: build.query<NotificationDTO[], void>({
            query: () => ({
                url:"/notifications/me",
                method: "GET",
            }),
             providesTags: [{ type: "Notifications" as const, id: "LIST" }],
        }),
      markNotificationAsRead: build.mutation<void, { notificationId: string }>({
      query: ({ notificationId }) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: [{ type: "Notifications" as const, id: "LIST" }],
    }),
    deleteNotification: build.mutation<void, {notificationId: string}> ({
      query: ({notificationId}) => ({
        url: `/notifications/${notificationId}`,
        method: "DELETE",
      }), invalidatesTags: [{ type: "Notifications" as const, id: "LIST" }],
    })
  }),
  overrideExisting: false,
});
export const {
  useGetMyNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;