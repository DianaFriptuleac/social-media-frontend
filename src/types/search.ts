import type { PageResponse } from "./page";

export interface UserSearchDTO {
  id: string;
  name: string;
  surname: string;
  email: string;
  avatar?: string;
}

export interface DepartmentSearchDTO {
  id: string;
  name: string;
  description?: string;
}

export interface EventSearchDTO {
  id: string;
  name: string;
  location?: string;
  startAt: string;
  endAt: string;
}

export interface JobSearchDTO {
  id: string;
  title: string;
  location?: string;
  departmentName?: string;
  applicationDeadline?: string;
}

export interface SearchResponseDTO {
  users: PageResponse<UserSearchDTO>;
  departments: PageResponse<DepartmentSearchDTO>;
  events: PageResponse<EventSearchDTO>;
  jobs: PageResponse<JobSearchDTO>;
}