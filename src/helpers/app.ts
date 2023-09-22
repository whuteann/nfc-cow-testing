import { ASSISTANT_COUNTRY_LEAD, COORDINATOR, COUNTRY_LEAD, COUNTRY_MANAGER, FARM_LEAD, FARM_STAFF, OFFICE_ADMIN, SUPERVISOR, TEAM_LEAD } from "@/permissions/RolePermissions";
import { ASSISTANT_COUNTRY_LEAD_ROLE, COORDINATOR_ROLE, COUNTRY_LEAD_ROLE, COUNTRY_MANAGER_ROLE, FARM_LEAD_ROLE, FARM_STAFF_ROLE, OFFICE_ADMIN_ROLE, SUPERVISOR_ROLE, TEAM_LEAD_ROLE } from "@/types/Common";


export const safeParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return 'Something went wrong. Please try again.';
  }
}

export const parseToBoolean = (data: any) => {
  const isBool = (typeof data === 'boolean')

  if (!isBool) {
    return data == 'true'
  }
  else {
    return data
  }
}

const reloadSession = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};

export async function updateSession() {
  const result = await fetch('/api/auth/session?update', {
    method: 'GET',
  });


  reloadSession();

  return result.ok;
}

export const encodeQueryData = (data: any) => {
  const ret = [];

  for (let d in data) {
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }

  return `?${ret.join('&')}`;
}

export const pluck = (arr: any = [], key: any) => arr?.map((i: any) => i[key]);

export const withCountryQuery = (filterName: string, countries: any) => {
  const filteredCountries = pluck(countries, 'id');

  return {
    [filterName]: {
      in: filteredCountries
    }
  }
}

export const getRolePermission = (role: string) => {
  let permissions: Array<string> = [];

  switch (role) {
    case COUNTRY_MANAGER_ROLE:
      permissions = COUNTRY_MANAGER;
      break;

    case COUNTRY_LEAD_ROLE:
      permissions = COUNTRY_LEAD;
      break;

    case ASSISTANT_COUNTRY_LEAD_ROLE:
      permissions = ASSISTANT_COUNTRY_LEAD;
      break;

    case OFFICE_ADMIN_ROLE:
      permissions = OFFICE_ADMIN;
      break;

    case TEAM_LEAD_ROLE:
      permissions = TEAM_LEAD;
      break;

    case SUPERVISOR_ROLE:
      permissions = SUPERVISOR;
      break;

    case FARM_LEAD_ROLE:
      permissions = FARM_LEAD;
      break;

    case FARM_STAFF_ROLE:
      permissions = FARM_STAFF;
      break;

    case COORDINATOR_ROLE:
      permissions = COORDINATOR;
      break;

    default:
      permissions = [];
      break;
  }


  return permissions;
}

export const dateToHuman = (date: string) => {
  var dateObject = new Date((date as unknown) as string)
  return `${convertIntToDay(dateObject.getDay())}, ${convertIntToMonth(dateObject.getMonth())} ${addNumberSuffix(dateObject.getDate())} ${dateObject.getFullYear()}, ${convertHoursAndMinutesToHuman(dateObject.getHours(), dateObject.getMinutes())}`;
}

const convertIntToDay = (int: Number) => {
  switch (int) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    case 7:
      return "Sunday";
  }
}

const convertIntToMonth = (int: number) => {
  switch (int) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
  }
}

const addNumberSuffix = (int: number) =>{
  var last_digit = int.toString()[int.toString().length - 1]
  if(last_digit == "1"){
    return `${int}st`
  }else if(last_digit == "2"){
    return `${int}nd`
  }else if(last_digit == "3" &&  int !== 13 ){
    return `${int}rd`
  }else{
    return `${int}th`
  }
}

const convertHoursAndMinutesToHuman = (hours: number, minutes: number) =>{
  var hoursMinus = hours - 12;
  if(hoursMinus > 0 ){
    return `${hoursMinus}:${minutes} p.m.`
  }else if(hoursMinus = 0){
    return `12:${minutes} p.m.`
  }else if(hours == 0 || hours == 24){
    return `12:${minutes} a.m.`
  }else{
    return `${hours}:${minutes} a.m.`
  }
}


export const shortenText = (text: string, maxLength: number) => {
  if (text?.length > maxLength) {
    return `${text.substring(0, maxLength)}...`
  }
  return text
}