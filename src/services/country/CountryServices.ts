import { encodeQueryData, safeParse } from "@/helpers/app";
import { ICountry } from "@/models/Country";
import { PaginationType } from "@/types/Common";

export const paginate = async (query: object, onSuccess: (data: PaginationType) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({ ...query, paginate: true });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/countries` + params, option)
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

export const index = async (search: any = '', filterCountry: boolean, onSuccess: (data: ICountry[]) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({
    search : search,
    filterCountry: filterCountry
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/countries` + params, option)
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

export const create = async (values: any, onSuccess: (country: ICountry) => void, onError: (error: string) => void) => {
  const data = {
    name: values.name,
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/countries`, {
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
    console.error(error)
    error.text().then((text: any) => onError(JSON.parse(text)));
  });
}

export const show = async (id: string, onSuccess: (country: ICountry) => void, onError: (error: string) => void) => {
  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/countries/${id}`, option)
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

export const edit = async ( values: any, onSuccess: (country: ICountry) => void, onError: (error: string) => void) => {
  const option = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(values)
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/countries/${values.id}`, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();
      
      onSuccess(result);
    })
    .catch(error => {
      error.text().then((text: any) => {
        onError(JSON.parse(text))
      });
    });
}

export const deleteCountry = async (countryId: any, onSuccess: () => void, onError: (error: string) => void) => {
  const option = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/countries/${countryId}`, option)
    .then((res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }
      
      onSuccess();
    })
    .catch(error => {
      error.text().then((text: any) => onError(JSON.parse(text)));
    });
}

export const getWithIds = async (countryIds: Array<string>) => {

  const params = encodeQueryData({
    countryIds: countryIds,
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  return await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/countries/ids` + params, option)
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