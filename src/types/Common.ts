import { ReactNode } from "react";

export type MetaProps = {
  title: string;
  description: string;
  canonical?: string;
};

export type LayoutProps = {
  metaProps?: MetaProps;
  children: ReactNode;
};

export type PrismaCustomResponse = {
  data: any,
  status: number
}

export type ResponseData = {
  message: string
}

export type Paginate = {
  data : any[],
  initPage: number,
  initLimit: number,
  totalCount: number,
}

export interface PageEdgeType {
  cursor: string;
  node: any;
}

export interface PageCursorType {
  cursor: string;
  page: number;
  isCurrent: boolean;
}

export interface PaginationType {
  pageEdges: [PageEdgeType];
  pageCursors: PageCursorType;
  totalCount: number;
}

export type Dropdown = {
  label : string,
  value: string
}

export type UserRole = 'Country Manager' | 'Country Lead'| 'Assistant Country Lead' | 'Office Admin' | 'Team Lead' | 'Supervisor' | 'Coordinator' | 'Farm Lead' | 'Farm Staff';

//Upper Up Roles
export const COUNTRY_MANAGER_ROLE = 'Country Manager'; //
export const COUNTRY_LEAD_ROLE = 'Country Lead'; //
export const ASSISTANT_COUNTRY_LEAD_ROLE = 'Assistant Country Lead'; //
export const OFFICE_ADMIN_ROLE = 'Office Admin'; //

//Dispersal Roles
export const TEAM_LEAD_ROLE = 'Team Lead';
export const SUPERVISOR_ROLE = 'Supervisor';
export const COORDINATOR_ROLE = 'Coordinator';

//Farm Roles
export const FARM_LEAD_ROLE = 'Farm Lead';
export const FARM_STAFF_ROLE = 'Farm Staff';

export const EMAIL_PLACEHOLDER = '@carechannels.org';