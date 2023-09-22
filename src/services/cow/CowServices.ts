import { encodeQueryData } from "@/helpers/app";
import { compressImg, uploadFileHelper, deleteFileHelper } from "@/helpers/S3Helper";
import { ICow } from "@/models/Cow";
import { ICowDispersal } from "@/models/Cow_Dispersal";
import { IFamilyCoordinator } from "@/models/Family";
import { IFarm } from "@/models/Farm";
import { Paginate } from "@/types/Common";
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from "@prisma/client";

export const paginate = async (query: object, onSuccess: (data: Paginate) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({...query, paginate: true });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cows` + params, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();
      
      onSuccess(result?.data);
    })
    .catch(error => {
      console.error(error);
      // error.text().then((text: any) => {
      //   console.error(text);
      // });
    });
}

export const index = async (query: object, onSuccess: (data: Prisma.CowCreateInput[]) => void, onError: (error: string) => void) => {
  const params = encodeQueryData(query);

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cows` + params, option)
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

export const getAliveCowsByFarmOrFamily = async (farm:any = undefined, family:any = undefined, nfcID:any = undefined, onSuccess: (data: ICow[]) =>void, onError: (error:string)=>void) => {
  const params = encodeQueryData({
    farm: farm || "",
    family: family || "",
    nfcID: nfcID || "",
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cows/get-alive-cows` + params, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();

      onSuccess(result.data);
    })
    .catch(error => {
      console.error(error)
    });
}

export const paginateDropdown = async (countryId: any, nfcID: any, status: string, onSuccess: (data: ICow[]) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({
    country : countryId,
    nfcID: nfcID,
    status: status
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cows/paginate-dropdown` + params, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();
      onSuccess(result.data);
    })
    .catch(error => {
      console.error(error)
      onError(error);
    });
}

export const addCow = async (values: any[], onSuccess: (cowDispersal: ICowDispersal) => void, onError: (error: string) => void) => {
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(values)
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

const directory = "cows"

const uploadImage = async(image:any ,fileName:any) => {

  const toUpload = await compressImg(image);
  const status = await uploadFileHelper(toUpload,fileName,directory)
  if (!status) {
    console.error("Error uploading the file, the file may be too large, 4mb max")
  }
}

export const edit = async (oldImage :any, values: any, onSuccess: (cow: ICow) => void, onError: (error: string) => void) => {
  
  let image:any
  let imageLink = oldImage
  let fileName:any

  //Check if a new file is uploaded or not
  if (typeof values.cowPhoto === 'object' &&  values.cowPhoto !== null){
    image = values.cowPhoto;
    const imageName = image.name.substring(0, image.name.indexOf('.')).split(" ").join("");
    const imageType = image.name.substring(image.name.indexOf('.') + 1);
    fileName = imageName + "_" + uuidv4() + "." + imageType;
    imageLink = `${process.env.NEXT_PUBLIC_CLOUDFRONT_IMAGE_URL}/cows/${fileName}`;
  }

  //Check if image value is null which means user deleted his image
  else if(values.image === null)
  {
    imageLink = ""
  }

  //Put Data into MongoDB
  let data = {
    nfcId: values.nfcId,
    cowPhoto: imageLink
  }

  const option = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cows/${values.id}`, option)
  .then( async (res: any) => {
    if(!res.ok) {
      return Promise.reject(res);
    }

    if (typeof image === 'object' &&  image !== null)
    {
      //Delete Old Image from AWS S3
      if(oldImage){
        deleteFileHelper(oldImage)
      }
      //Upload Image into AWS S3
      await uploadImage(image ,fileName)
    }

    //Delete Image if image link is empty
    else if (imageLink === '' && oldImage != '')
    {
      deleteFileHelper(oldImage)
    }

    onSuccess(res);
  })
  .catch(error => {
    error.text().then((text: any) => {
      onError(JSON.parse(text))
    });
  });
}

export const getCowsByGenderAndFarms = async (gender: string, farms: IFarm[], onSuccess: (data: ICow[]) => void, onError: (error: string) => void) => {
  let farmNames: string[] = [];

  farms.forEach((farm: IFarm) => {
    farmNames.push(farm.name);
  });

  const params = encodeQueryData({
    gender: gender,
    farms: farms
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cows/breeding-records-filter` + params, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();
      
      onSuccess(result.data);
    })
    .catch(error => {
      console.error(error)
    });
}


export const countCows = async (familySearch: any = undefined, status: string, onSuccess: (data: number) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({
    familyIdSearch: familySearch,
    countCows: true,
    status: status
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cows` + params, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();

      onSuccess(result.data);
    })
    .catch(error => {
      console.error(error)
    });
}

export const show = async (id: string, onSuccess: (cow: ICow) => void, onError: (error: string) => void) => {
  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cows/${id}`, option)
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

export const getWithIds = async (cowIds: Array<string>) => {

  const params = encodeQueryData({
    cowIds: cowIds,
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  return await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cows/ids` + params, option)
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

export const getCountDashboard = async (onSuccess: (data)=>void) =>{

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  return await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cows/get-count`, option)
    .then(async (res: any) => {
      if (!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();

      onSuccess(result.data);
    })
    .catch(error => {
      console.error(error);
    });
}

export function calculateAge(birthDate) {
  const convertedBirthDate = new Date(birthDate);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const birthYear = convertedBirthDate.getFullYear();
  const birthMonth = convertedBirthDate.getMonth() + 1;

  let ageYears = currentYear - birthYear;
  let ageMonths = currentMonth - birthMonth;

  if (ageMonths <= 0) {
    ageYears--;
    ageMonths += 12;
  }

  if(ageMonths == 12){
    ageYears++;
    ageMonths = ageMonths - 12;
  }

  return `${ageYears} year(s) ${ageMonths} month(s)`
}