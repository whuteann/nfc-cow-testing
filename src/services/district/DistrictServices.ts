import { IDistrict } from "@/models/District";
import { encodeQueryData, safeParse } from "@/helpers/app";
import { Paginate, PaginationType } from "@/types/Common";
import { Prisma } from "@prisma/client";

export const paginate = async (query: object, onSuccess: (data: PaginationType) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({ ...query, paginate: true });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/districts` + params, option)
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

export const index = async (query: object, onSuccess: (data: Prisma.DistrictCreateInput[]) => void, onError: (error: string) => void) => {
  const params = encodeQueryData(query);

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/districts` + params, option)
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

export const create = async (values: any, onSuccess: (district: IDistrict) => void, onError: (error: string) => void) => {
  let data = {
    id: values?.id,
    name: values?.name,
    country: values?.country?.id
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/districts`, {
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

export const getDistrictsByCountry = async (country: string, onSuccess: (districts: IDistrict[]) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({
    country: country
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/districts` + params, option)
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

export const showSpecificDistrict = async (id: string, onSuccess: (district: IDistrict) => void, onError: (error: string) => void) => {

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/districts/${id}`, option)
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

export const edit = async (values: any, onSuccess: (district: IDistrict) => void, onError: (error: string) => void) => {
  let data = {
    id: values?.id,
    name: values?.name,
    country: values?.country?.id
  }

  const option = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/districts/${data.id}`, option)
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

export const deleteDistrict = async (districtId: any, onSuccess: () => void, onError: (error: string) => void) => {
  const option = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  }
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/districts/${districtId}`, option)
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

export const getWithIds = async (districtIds: Array<string>) => {

  const params = encodeQueryData({
    districtIds: districtIds,
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  return await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/districts/ids` + params, option)
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