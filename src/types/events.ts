export type EventType = 
  | "MEETING"
  | "PARTY"
  | "TRAINING"
  | "WORKSHOP"
  | "WEBINAR"
  | "OTHER";

  export type EventAudienceType =
  | "ALL_EMPLOYEES"
  | "DEPARTMENTS"
  | "SPECIFIC_USERS"
  | "MIXED";

export type ParticipationStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface EventListItem {
  id: string;
  name: string;
  location: string;
  startAt: string;
  endAt: string;
  type: EventType;
  audienceType: EventAudienceType;
  createdBy: string;
  createdByName: string;
  totalInvited: number;
  acceptedCount: number;
  declinedCount: number;
  pendingCount: number;
}

export interface EventParticipantView {
  userId: string;
  name: string;
  surname: string;
  email: string;
  avatar: string | null;
  status: ParticipationStatus;
}

export interface EventDetail {
  id: string;
  name: string;
  location: string;
  description: string;
  startAt: string;
  endAt: string;
  type: EventType;
  audienceType: EventAudienceType;
  createdBy: string;
  createdByName: string;
  totalInvited: number;
  acceptedCount: number;
  declinedCount: number;
  pendingCount: number;
  departments: string[];
  participants: EventParticipantView[];
}

export interface EventResponse {
  id: string;
  name: string;
  location: string;
  description: string;
  startAt: string;
  endAt: string;
  type: EventType;
  audienceType: EventAudienceType;
  createdById: string;
}

export interface EventCreateOrUpdateBody {
  name: string;
  location: string;
  description: string;
  startAt: string;
  endAt: string;
  type: EventType;
  audienceType: EventAudienceType;
  departmentIds: string[];
  userIds: string[];
}

export interface EventParticipationUpdateBody {
  status: Exclude<ParticipationStatus, "PENDING">;
}

export interface EventParticipationResponse {
  status: ParticipationStatus;
}