import { encodeQueryData, safeParse } from "@/helpers/app";
import { ICountry } from "@/models/Country";
import { ITownVillage } from "@/models/TownVillage";
import { PaginationType } from "@/types/Common";
import { Prisma } from "@prisma/client";

export const paginate = async (query: object, onSuccess: (data: PaginationType) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({ ...query, paginate: true });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/townvillages` + params, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();
      
      onSuccess(result?.data);
    })
    .catch(error => {
      error.text().then((text: any) => onError(safeParse(text)));
    });
}

export const index = async (query: object, onSuccess: (data: Prisma.TownVillageCreateInput[]) => void, onError: (error: string) => void) => {
  const params = encodeQueryData(query);

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/townvillages` + params, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();
      
      onSuccess(result.data);
    })
    .catch(error => {
      error.text().then((text: any) => onError(JSON.parse(text)));
    });
}


export const getTownVillageByCountries = async (countries: ICountry[], filterCountry: boolean, onSuccess: (townVillages: ITownVillage[]) => void, onError: (error: string) => void) => {
  let countryNames: string[] = [];

  countries.forEach((country: ICountry) => {
    countryNames.push(country.name);
  });

  const params = encodeQueryData({
    countries: countryNames,
    filterCountry: filterCountry
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/townvillages` + params, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();
      onSuccess(result.data);
    })
    .catch(error => {
      error.text().then((text: any) => onError(JSON.parse(text)));
    });
}

export const showSpecificTownVillage = async ( id: string ,onSuccess: (data: ITownVillage) => void, onError: (error: string) => void) => {

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/townvillages/${id}`, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();
      
      onSuccess(result.data);
    })
    .catch(error => {
      error.text().then((text: any) => onError(JSON.parse(text)));
    });
}

export const addTownVillage = async (values : any, onSuccess: (townVillage: Prisma.TownVillageCreateInput) => void, onError: (error: string) => void) => {
  const data = {
    district: values.district?.id,
    townVillage: values.townVillage,
    name: values.name,
  }
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/townvillages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then((res: any) => {
    if(!res.ok) {
      return Promise.reject(res);
    }

    onSuccess(res);
  })

  .catch(error => {
    error.text().then((text: any) => onError(JSON.parse(text)));
  });
}

export const updateTownVillage = async (values: any, onSuccess: (townVillage: Prisma.TownVillageCreateInput) => void, onError: (error: any) => void) => {
  const data = {
    district: values.district?.id,
    townVillage: values.townVillage,
    name: values.name,
  }
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/townvillages/${values?.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  })

  .then((res: any) => {
    if(!res.ok) {
      return Promise.reject(res);
    }

    onSuccess(res);
  })

  .catch(error => {
    error.text().then((text: any) => onError(JSON.parse(text)));
  });
}

export const deleteTownVillage = async (townVillageId: any, onSuccess: (townVillage: Prisma.TownVillageCreateInput) => void, onError: (error: any) => void) => {
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/townvillages/${townVillageId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  })
  .then((res: any) => {
    if(!res.ok) {
      return Promise.reject(res);
    }
    
    onSuccess(res);
  })
  .catch(error => {
    error.text().then((text: any) => onError(JSON.parse(text)));
  });
}

export const getWithIds = async (townVillageIds: Array<string>) => {

  const params = encodeQueryData({
    townVillageIds: townVillageIds,
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  return await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/townvillages/ids` + params, option)
    .then(async (res: any) => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();
      return result.data;
    })
    .catch(error => {
      console.error(error);
    });
}