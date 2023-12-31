import { ASSIGN_FAMILY_COW_DISPERSALS, ASSIGN_FARM_COW_SALES, ASSIGN_TAGS_FAMILIES_COORDINATORS, VIEW_FAMILY_FARM_TRANSFER_REQUESTS, COMPLETE_FAMILY_FARM_TRANSFER_REQUESTS, COMPLETE_FAMILY_TRANSFER_REQUESTS, CREATE_COW_PURCHASE_REQUESTS, CREATE_FAMILIES_COORDINATORS, CREATE_FAMILY_COW_DISPERSALS, CREATE_FAMILY_COW_SALES, CREATE_FAMILY_FARM_TRANSFER_REQUESTS, CREATE_FAMILY_TRANSFER_REQUESTS, CREATE_FAMILY_VISITATIONS, CREATE_FARM_BREEDING_RECORDS, CREATE_FARM_COW_SALES, CREATE_FARM_FAMILY_MEDICATIONS, MANAGE_COUNTRIES, MANAGE_DISTRICTS, MANAGE_FARMS, MANAGE_TOWN_VILLAGES, MANAGE_USERS, REVIEW_COW_PURCHASE_REQUESTS, REVIEW_FAMILIES_COORDINATORS, REVIEW_FAMILY_COW_DISPERSALS, REVIEW_FAMILY_FARM_TRANSFER_REQUESTS, REVIEW_FAMILY_TRANSFERS_REQUESTS, REVIEW_FARM_COW_SALES, TAG_FAMILY_BREEDING_RECORDS, TAG_FARM_BREEDING_RECORDS, TAG_FARM_COWS, TALLY_FAMILY_COW_SALES, VIEW_FAMILIES_COORDINATORS, VIEW_FAMILY_BREEDING_RECORDS, VIEW_FAMILY_COW_DISPERSALS, VIEW_FAMILY_VISITATIONS, VIEW_FARM_BREEDING_RECORDS, VIEW_FARM_FAMILY_MEDICATIONS, REVIEW_COW_DEATHS, VIEW_COW_DEATHS, VIEW_ALL_COW_BANKS, VIEW_COW_BANKS } from "./Permissions";

export const COORDINATOR = [
  VIEW_FAMILY_COW_DISPERSALS,
  // ASSIGN_TAGS_FAMILIES_COORDINATORS,
  // CREATE_FAMILY_COW_DISPERSALS,
  // ASSIGN_FAMILY_COW_DISPERSALS,
  VIEW_FARM_FAMILY_MEDICATIONS,
  VIEW_FAMILY_VISITATIONS,
  CREATE_FAMILY_TRANSFER_REQUESTS,
  COMPLETE_FAMILY_TRANSFER_REQUESTS,
  CREATE_FAMILY_VISITATIONS,
  CREATE_FAMILY_COW_SALES,
  CREATE_FARM_FAMILY_MEDICATIONS,
  VIEW_FAMILY_BREEDING_RECORDS,
  TAG_FAMILY_BREEDING_RECORDS,
  VIEW_FAMILY_FARM_TRANSFER_REQUESTS
];

export const FARM_STAFF = [
  ...Array.from(new Set([
    CREATE_FARM_COW_SALES,
    TAG_FARM_COWS,
    ASSIGN_FARM_COW_SALES,
    VIEW_FARM_BREEDING_RECORDS,
    CREATE_FARM_BREEDING_RECORDS,
    TAG_FARM_BREEDING_RECORDS,
    VIEW_FAMILY_FARM_TRANSFER_REQUESTS,
    CREATE_FAMILY_FARM_TRANSFER_REQUESTS,
    COMPLETE_FAMILY_FARM_TRANSFER_REQUESTS,
  ]))
];

export const FARM_LEAD = [
  ...Array.from(new Set([
    CREATE_COW_PURCHASE_REQUESTS,
    VIEW_COW_BANKS,
    ...FARM_STAFF
  ]))
];

export const SUPERVISOR = [
  ...Array.from(new Set([
    VIEW_FAMILIES_COORDINATORS,
    ASSIGN_TAGS_FAMILIES_COORDINATORS,
    CREATE_FAMILY_COW_DISPERSALS,
    ASSIGN_FAMILY_COW_DISPERSALS,
    ...COORDINATOR
  ]))
];

export const TEAM_LEAD = [
  ...SUPERVISOR
];

export const OFFICE_ADMIN = [
  ...Array.from(new Set([
    CREATE_FAMILIES_COORDINATORS,
    TALLY_FAMILY_COW_SALES,
    VIEW_COW_DEATHS,
    MANAGE_DISTRICTS,
    MANAGE_TOWN_VILLAGES,
    VIEW_COW_BANKS,
    VIEW_ALL_COW_BANKS,
    ...TEAM_LEAD
  ]))
];

export const COUNTRY_LEAD = [
  ...Array.from(new Set([
    REVIEW_FAMILIES_COORDINATORS,
    REVIEW_FAMILY_COW_DISPERSALS,
    REVIEW_COW_DEATHS,
    REVIEW_FARM_COW_SALES,
    REVIEW_FAMILY_TRANSFERS_REQUESTS,
    REVIEW_FAMILY_FARM_TRANSFER_REQUESTS,
    ...OFFICE_ADMIN,
    ...FARM_LEAD
  ]))
];

export const ASSISTANT_COUNTRY_LEAD = [
  ...COUNTRY_LEAD
];

export const COUNTRY_MANAGER = [
  MANAGE_USERS,
  MANAGE_COUNTRIES,
  MANAGE_FARMS,
  REVIEW_COW_PURCHASE_REQUESTS,
  ...COUNTRY_LEAD
];
