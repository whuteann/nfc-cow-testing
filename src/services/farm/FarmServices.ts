import { encodeQueryData, safeParse } from "@/helpers/app";
import { ICountry } from "@/models/Country";
import { IFarm } from "@/models/Farm";
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
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/farms` + params, option)
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

export const index = async (query: object, onSuccess: (data: Prisma.FarmCreateInput[]) => void, onError: (error: string) => void) => {
  const params = encodeQueryData(query);
  
  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/farms` + params, option)
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

export const getFarmByCountries = async (countries: ICountry[], filterCountry: boolean, onSuccess: (farms: IFarm[]) => void, onError: (error: string) => void) => {
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

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/farms` + params, option)
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

export const showSpecificFarm = async ( id: string ,onSuccess: (data: IFarm) => void, onError: (error: string) => void) => {

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/farms/${id}`, option)
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

export const addFarm = async (values : any, onSuccess: (farm: Prisma.FarmCreateInput) => void, onError: (error: string) => void) => {
  const data = {
    district: values.district?.id,
    name: values.name,
  }
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/farms`, {
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

export const updateFarm = async (values: any, onSuccess: (farm: Prisma.FarmCreateInput) => void, onError: (error: any) => void) => {
  const data = {
    district: values.district?.id,
    name: values.name,
  }
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/farms/${values?.id}`, {
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

export const deleteFarm = async (farmId: any, onSuccess: (farm: Prisma.FarmCreateInput) => void, onError: (error: any) => void) => {
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/farms/${farmId}`, {
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

export const getTotalFarmCows = async (farmId: String, onSuccess: (result:any)=>void, onError: (err:any)=>void) =>{

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/totalFarmCows/${farmId}`, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();
      
      onSuccess(result?.data);
    })
    .catch(error => {
      onError(error);
    });
}


export const getWithIds = async (farmIds: Array<string>) => {

  const params = encodeQueryData({
    farmIds: farmIds,
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  return await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/farms/ids` + params, option)
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