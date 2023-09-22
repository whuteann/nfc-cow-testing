import { encodeQueryData } from "@/helpers/app";
import { ICowPurchaseRequest } from "@/models/Cow_Purchase_Request";
import { IFamilyFarmTransferRequest } from "@/models/Family_Farm_Transfer_Request";
import { Paginate } from "@/types/Common";

export const create = async (values: any, onSuccess: (request: ICowPurchaseRequest) => void, onError: (error: string) => void) => {

  const data = {
    family: values.family,
    farm: values.farm,
    noOfCows: Number(values.noOfCows)
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/familyFarmTransferRequests/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({data})
  })

  .then(async (res: any) => {
    if(!res.ok) {
      return Promise.reject(res);
    }

    onSuccess(res);
  })

  .catch(error => {
    error.text().then((text: any) => onError(JSON.parse(text)));
  });
}

export const paginate = async (query: object, onSuccess: (data: Paginate) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({...query, paginate: true});

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/familyFarmTransferRequests` + params, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();

      onSuccess(result?.data);
    })
    .catch(error => {
      error.text().then((text: any) => onError(JSON.parse(text)));
    });
}

export const showSpecificRequest = async (id:string, onSuccess: (request: IFamilyFarmTransferRequest) => void, onError: (error: string) => void) => {

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/familyFarmTransferRequests/${id}`, option)
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

export const updateRequest = async (id: any, familyFarmTransferRequest: any, approval: any,  rejectionReason: any, onSuccess: (familyFarmTransferRequest: IFamilyFarmTransferRequest) => void, onError: (error: any) => void) => {

  if (approval === 'Approved') {
    rejectionReason = ''
  } 
  else {
    rejectionReason = rejectionReason
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/familyFarmTransferRequests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({familyFarmTransferRequest, approval, rejectionReason})
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