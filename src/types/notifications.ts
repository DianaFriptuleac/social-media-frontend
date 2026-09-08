export type NotificationDTO = {
  id: string;
  title: string;
  message: string;
  type: string;
  eventId?: string | null;
  read: boolean;
  createdAt: string;
  targetAvailable: boolean;
};