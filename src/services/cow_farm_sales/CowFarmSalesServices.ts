import { encodeQueryData } from "@/helpers/app";
import { ICowFarmSaleRequest } from "@/models/Cow_Farm_Sale_Request";
import { Paginate, PaginationType } from "@/types/Common";
import { id } from "date-fns/locale";

export const create = async (values: any, onSuccess: (request: any) => void, onError: (error: string) => void) => {
  let cowsId = []
  values.cows.map((cow) => cowsId.push(cow.id))
  
  const data = {
    farm: values.farm.id,
    quantity: values.cows.length,
    status: 'Pending',
    cows: cowsId
  }


  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowFarmSaleRequests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  })

    .then((res: any) => {
      if (!res.ok) {
        return Promise.reject(res);
      }
      onSuccess(res);
    })
    .catch(error => {
      error.text().then((text: any) => onError(JSON.parse(text)));
    });
}

export const paginate = async (query: object, onSuccess: (data: PaginationType) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({ ...query, paginate: true });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowFarmSaleRequests` + params, option)
    .then(async (res: any) => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();

      onSuccess(result?.data);
    })
    .catch(error => {
      error.text().then((text: any) => onError(JSON.parse(text)));
    });
}

export const showSpecificRequest = async (id: string, onSuccess: (request: ICowFarmSaleRequest) => void, onError: (error: string) => void) => {

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowFarmSaleRequests/${id}`, option)
    .then(async (res: any) => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();

      onSuccess(result.data);
    })
    .catch(error => {
      error.text().then((text: any) => onError(JSON.parse(text)));
    });
}

export const edit = async (values: any, onSuccess: (result: any) => void, onError: (error: any) => void) => {
  // if (approval === 'Approved') {
  //   rejectionReason = ''
  // }
  // else {
  //   rejectionReason = rejectionReason
  // }


    //Put Data into MongoDB
    let data = {
      id : values.id,
      status: values.approval,
      rejectedReason: values?.rejectedReason? values.rejectedReason : '',
      cows: values.cows,
    }



  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowFarmSaleRequests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  })
    .then((res: any) => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      onSuccess(res);
    })
    .catch(error => {
      error.text().then((text: any) => {
        onError(JSON.parse(text))
      });
    });
}