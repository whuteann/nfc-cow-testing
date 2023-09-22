import { encodeQueryData, safeParse } from "@/helpers/app";
import { IBreedingRecord } from "@/models/Breeding_Record";
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

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/breedingRecords` + params, option)
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

export const index = async (query: object, onSuccess: (data: Prisma.BirthRecordCreateInput[]) => void, onError: (error: string) => void) => {
  const params = encodeQueryData(query);

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/breedingRecords/[]`+ params, option)
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


export const create = async (values: any, onSuccess: (birthRecord: Prisma.BirthRecordCreateInput) => void, onError: (error: string) => void) => {
  const data = {
    option: values?.option,
    farmId: values?.farm?.id,
    status: values?.status,
    dateOfBirth: values?.dateOfBirth,
    aliveCalves: parseInt(values?.aliveCalves),
    deadCalves : parseInt(values?.deadCalves),
    comment : values?.comment == "" ? "-" : values.comment,
    cowId: values?.cow?.id,
  }



  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/breedingRecords/`, {
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

export const show = async (id: string, onSuccess: (breeding_record: IBreedingRecord) => void, onError: (error: string) => void) => {
  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/breedingRecords/${id}`, option)
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