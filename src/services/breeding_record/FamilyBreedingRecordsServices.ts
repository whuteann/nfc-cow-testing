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

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/familyBreedingRecords` + params, option)
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

