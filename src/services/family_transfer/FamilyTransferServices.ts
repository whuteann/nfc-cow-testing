import { IFamilyCoordinator } from "@/models/Family";
import { encodeQueryData } from "@/helpers/app";
import { Paginate } from "@/types/Common";
import { IFamilyTransferRequest } from "@/models/Family_Transfer_Requests";

const directory = "family-transfer-requests"

export const paginate = async (query: object, onSuccess: (data: Paginate) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({...query, paginate: true});

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/familyTransferRequests` + params, option)
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

export const addFamilyTransferRequest = async (values: any, onSuccess: (familyTransferRequest: IFamilyTransferRequest) => void, onError: (error: string) => void) => {

  const data = {
    status: values.status,
    family1: values.family1,
    family2: values.family2,
    date: values.date,
    noOfCows: Number(values.noOfCows)
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/familyTransferRequests`, {
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
    console.error(error)
    error.text().then((text: any) => onError(JSON.parse(text)));
  });
}

export const updateRequest = async (id: any, familyTransfer: any, approval: any,  rejectionReason: any, onSuccess: (familyTransfer: IFamilyTransferRequest) => void, onError: (error: any) => void) => {

  if (approval === 'Approved') {
    rejectionReason = ''
  } 
  else {
    rejectionReason = rejectionReason
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/familyTransferRequests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({familyTransfer, approval, rejectionReason})
  })

  .then(async (res: any) => {
    if(!res.ok) {
      return Promise.reject(res);
    }

    // const result = await res.json()
    onSuccess(res);
  })

  .catch(error => {
    error.text().then((text: any) => onError(JSON.parse(text)));
  });
}

export const show = async (id: string, onSuccess: (data: IFamilyTransferRequest) => void, onError: (error: string) => void) => {
  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/familyTransferRequests/${id}`, option)
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