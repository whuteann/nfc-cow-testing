import { getWithIds as getCountries } from "@/services/country/CountryServices";
import { getWithIds as getFarms } from "@/services/farm/FarmServices";
import { getWithIds as getDistricts } from "@/services/district/DistrictServices";
import { getWithIds as getTownVillages } from "@/services/townvillage/TownVillageServices";
import { getWithIds as getFamilies } from "@/services/family/FamilyServices";
import { getWithIds as getUsers } from "@/services/user/UserServices";
import { getWithIds as getCows } from "@/services/cow/CowServices";
import { ChangeDetailsString } from "@/components/templates/logs/ChangeDetailsString";
import { ChangeDetailsObject } from "@/components/templates/logs/ChangeDetailsObject";
import { ChangeDetailsFile } from "@/components/templates/logs/ChangeDetailsFile";

const models = {
  countryIds: 'country',
  farmIds: 'farm',
  countryId: 'country',
  districtId: 'district',
  townVillageId: 'townVillage',
  coordinatorId: 'family',
  overseeTownsVillagesIds: 'townVillage',
  supervisorId: "user",
  cowIds: "cow",
  calvesSnapshots: "cow",
  cowSnapshots: "cow"
};

export const formatField = (str) => {
  const formattedStr = str.replace(/([A-Z])/g, ' $1').replace(/^./, str[0].toUpperCase());
  return formattedStr.replace(' Ids', "s").replace(' Id', "").replace(' Snapshots', "");
}


export const renderDetails = async (oldValue, newValue, field) => {

  const { oValue, nValue } = await processValues(oldValue, newValue, field);

  const type = nValue ? typeof nValue : typeof oValue

  switch (type) {
    case "string":
      const isFile = /\.(png|jpe?g|pdf|webp)$/.test(nValue) || /\.(png|jpe?g|pdf|webp)$/.test(oValue);
      if (isFile) {
        return <ChangeDetailsFile oldValue={oValue} newValue={nValue} />
      } else {
        return <ChangeDetailsString oldValue={oValue} newValue={nValue} />
      }
    case "number":
      return <ChangeDetailsString oldValue={oValue} newValue={nValue} />
    case "object":
      return <ChangeDetailsObject oldValue={oValue} newValue={nValue} />;
    default:
      break;
  }
}

const processValues = async (oldValue, newValue, field) => {
  let oValue = oldValue;
  let nValue = newValue;


  if (models[field]) {
    switch (models[field]) {
      case "country":
        const [promisedOValueCountry, promisedNValueCountry] = await Promise.all([
          getCountries(Array.isArray(oldValue) ? oldValue : [oldValue]),
          getCountries(Array.isArray(newValue) ? newValue : [newValue])
        ]);
        oValue = promisedOValueCountry ? promisedOValueCountry.map(country => { return country.name }) : []
        nValue = promisedNValueCountry ? promisedNValueCountry.map(country => { return country.name }) : []
        break;
      case "farm":
        const [promisedOValueFarm, promisedNValueFarm] = await Promise.all([
          getFarms(Array.isArray(oldValue) ? oldValue : [oldValue]),
          getFarms(Array.isArray(newValue) ? newValue : [newValue])
        ]);
        oValue = promisedOValueFarm ? promisedOValueFarm.map(farm => { return farm.name }) : []
        nValue = promisedNValueFarm ? promisedNValueFarm.map(farm => { return farm.name }) : []
        break;
      case "district":
        const [promisedOValueDistrict, promisedNValueDistrict] = await Promise.all([
          getDistricts(Array.isArray(oldValue) ? oldValue : [oldValue]),
          getDistricts(Array.isArray(newValue) ? newValue : [newValue])
        ]);
        oValue = promisedOValueDistrict ? promisedOValueDistrict.map(district => { return district.name }) : []
        nValue = promisedNValueDistrict ? promisedNValueDistrict.map(district => { return district.name }) : []
        break;
      case "townVillage":
        const [promisedOValueTownVillage, promisedNValuetownVillage] = await Promise.all([
          getTownVillages(Array.isArray(oldValue) ? oldValue : [oldValue]),
          getTownVillages(Array.isArray(newValue) ? newValue : [newValue])
        ]);
        oValue = promisedOValueTownVillage ? promisedOValueTownVillage.map(townVillage => { return townVillage.name }) : []
        nValue = promisedNValuetownVillage ? promisedNValuetownVillage.map(townVillage => { return townVillage.name }) : []
        break;
      case "family":
        const [promisedOValueFamily, promisedNValueFamily] = await Promise.all([
          getFamilies(Array.isArray(oldValue) ? oldValue : [oldValue]),
          getFamilies(Array.isArray(newValue) ? newValue : [newValue])
        ]);
        oValue = promisedOValueFamily ? promisedOValueFamily.map(family => { return family.name }) : []
        nValue = promisedNValueFamily ? promisedNValueFamily.map(family => { return family.name }) : []
        break;
      case "user":
        const [promisedOValueUser, promisedNValueUser] = await Promise.all([
          getUsers(Array.isArray(oldValue) ? oldValue : [oldValue]),
          getUsers(Array.isArray(newValue) ? newValue : [newValue])
        ]);
        oValue = promisedOValueUser ? promisedOValueUser.map(user => { return `${user.firstName} ${user.lastName}` }) : []
        nValue = promisedNValueUser ? promisedNValueUser.map(user => { return `${user.firstName} ${user.lastName}` }) : []
        break;
      case "cow":
        let oriLength = newValue.length;

        if (typeof newValue == "string") {
          newValue = newValue.split(',')
          oriLength = newValue.length
          newValue = newValue.filter(i => i != "null")
        }

        const [promisedOValueCow, promisedNValueCow] = await Promise.all([
          getCows(Array.isArray(oldValue) ? oldValue : [oldValue]),
          getCows(Array.isArray(newValue) ? newValue : [newValue])
        ]);

        oValue = promisedOValueCow ? promisedOValueCow.map(cow => { return cow.nfcId }) : []

        if (!promisedNValueCow) {
          let array = []
          for (let i = 1; i < oriLength + 1; i++) {
            array.push(`Dead Calf #${i}`)
          }

          nValue = array;
        } else {
          nValue = promisedNValueCow ? promisedNValueCow.map(cow => { return cow.nfcId }) : []
          if(nValue.length != oriLength){
            let amountLeft = oriLength - nValue.length + 1;
            for(let i = 1; i < amountLeft; i++ ){
              nValue.push(`Dead Calf #${i}`)
            }
          }
        }
        break;
      default:
        break;
    }
  } else {
    oValue = oldValue;
    nValue = newValue;
  }

  return { oValue: oValue, nValue: nValue };
}