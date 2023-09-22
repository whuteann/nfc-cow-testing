import { encodeQueryData, safeParse } from "@/helpers/app";
import { ICowPurchaseRequest } from "@/models/Cow_Purchase_Request";
import { Paginate } from "@/types/Common";

export const create = async (values: any, onSuccess: (request: ICowPurchaseRequest) => void, onError: (error: string) => void) => {

  const data = {
    farm: values.farm.id,
    noOfCows: Number(values.noOfCows),
    pricePerCow: Number(values.pricePerCow),
    reasonForPurchase: values.reasonForPurchase,
    calculatedPurchasePrice: Number(values.calculatedPurchasePrice),
    status: 'Pending',
  }


  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowPurchaseRequests/`, {
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
    
    // let result = await res.json();

    onSuccess(res);
  })
  .catch(async (error) => {

    let result = await error.json();

    // error.text().then((text: any) => onError(JSON.parse(text)));
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
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowPurchaseRequests` + params, option)
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

export const showSpecificRequest = async (id:string, onSuccess: (request: ICowPurchaseRequest) => void, onError: (error: string) => void) => {

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowPurchaseRequests/${id}`, option)
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

export const edit = async (data:any, approval: any, id:any, farm: any, totalAmount: any, onSuccess: (request: ICowPurchaseRequest) => void, onError: (error: any) => void) => {
  
  let rejectionReason;

  if (approval === 'Approved') {
    data.status = "Approved"
    rejectionReason = ''
  } 
  else {
    data.status = "Rejected"
    rejectionReason = data.rejectionReason
  }
  
  const option = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({data, approval, rejectionReason, farm, totalAmount})
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowPurchaseRequests/${id}`, option)
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