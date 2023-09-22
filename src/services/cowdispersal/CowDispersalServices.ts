import { encodeQueryData, safeParse } from "@/helpers/app";
import { compressImg, uploadFileHelper } from "@/helpers/S3Helper";
import { ICowDispersal } from "@/models/Cow_Dispersal";
import { ITownVillage } from "@/models/TownVillage";
import { Paginate, PaginationType } from "@/types/Common";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

export const paginate = async (query: object, onSuccess: (data: PaginationType) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({ ...query, paginate: true });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowdispersals` + params, option)
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

export const showSpecificCowDispersal = async (id: string, onSuccess: (data: ICowDispersal) => void, onError: (error: string) => void) => {
  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowdispersals/${id}`, option)
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

export const addCowDispersal = async (values: any, onSuccess: (cowDispersal: ICowDispersal) => void, onError: (error: string) => void) => {
  const convertedFamiliesCoordinators = values?.familiesCoordinators?.map((familyCoordinator) => {
    return {
      id: familyCoordinator?.family?.id,
      noOfCows: familyCoordinator?.noOfCows 
    }
  });
  
  const data = {
    status: values.status,
    date: values.date,
    familiesCoordinators: convertedFamiliesCoordinators
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowdispersals`, {
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

const directory = "cows"

const uploadImage = async(image:any, fileName:any) => {
let toUpload: any = image;
  if(image.type !== "application/pdf" ){
    toUpload = await compressImg(image);
  }

  const status = await uploadFileHelper(toUpload,fileName,directory)
  if (!status) {
  }
}

// const parsingForImage = async (image: any) => {
//   const imageName = image.name.substring(0, image.name.indexOf('.')).split(" ").join("");
//   const imageType = image.name.substring(image.name.indexOf('.') + 1);
//   const fileName = imageName + "_" + uuidv4() + "." + imageType;
//   const fileLink = `${process.env.NEXT_PUBLIC_CLOUDFRONT_IMAGE_URL}/${directory}/${fileName}`;

//   return {
//     fileName,
//     fileLink
//   };
// }

const processForm = (value: any) => {

  let name: any = undefined;
  let link: any = undefined;
  let type: any = undefined;

  type = value.substring(value.lastIndexOf('.'))
  name = value.substring(value.lastIndexOf('/') + 1, value.lastIndexOf('.'))
  name = name + type
  link = value;

  return {
    value: value,
    name: name,
    type: type,
    link: link
  }
}

export const completeCowDispersal = async (cowDispersal: Prisma.CowDispersalCreateInput, values: any, onSuccess: (cowDispersal: String) => void, onError: (error: any) => void) => {
  const cows = values.cows;
  
  // TODO : Check if nfc id already exist adn throw error

  const modifiedCows = cows.map((cow: any) => {

    if (cow.status !== 'Dispersed'){
      if(cow.signedDispersalAgreement) {
        // check if pdf
        const signedDispersalAgreementForm = processForm(cow.signedDispersalAgreement)

        if (signedDispersalAgreementForm.type === ".pdf"){
          cow.signedDispersalAgreementFilename = signedDispersalAgreementForm.name
        }

        cow.signedDispersalAgreement = signedDispersalAgreementForm.link
      }

      if(cow.signedLegalDoc) {
        // check if pdf
        const signedLegalDocForm = processForm(cow.signedLegalDoc)

        if (signedLegalDocForm.type === ".pdf"){
          cow.signedLegalDocFilename = signedLegalDocForm.name
        }

        cow.signedLegalDoc = signedLegalDocForm.link
      }
    }

    return cow;
  });

  const data = {
    country: (cowDispersal?.family as any)?.townVillage?.district?.country.id,
    family: (cowDispersal?.family as any)?.id,
    cows: modifiedCows,

    //links
    // cowPhotoLink: cowPhotoLink,
    // signedDispersalAgreementLink: signedDispersalAgreementLink,
    // signedLegalDocLink: signedLegalDocLink,
    // cowWithFamilyPhotoLink: cowWithFamilyPhotoLink
  }

  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowdispersals/${cowDispersal?.id}/assign`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  })

  .then(async (res: any) => {
    if(!res.ok) {
      return Promise.reject(res);
    }

    // // Upload images into Amazon S3
    // if(files.length > 0){
    //   await files.map(async (file:any,index:any) => {
    //     await uploadImage(file, fileNames[index])
    //   })
    // }
    
    onSuccess(res);
  })

  .catch(error => {
    error.text().then((text: any) => onError(text));
  });
}

export const updateRequest = async (id: any, cowDispersal: any, approval: any,  rejectionReason: any, onSuccess: (country: ITownVillage) => void, onError: (error: any) => void) => {
  if (approval === 'Approved') {
    rejectionReason = ''
  } 
  else {
    rejectionReason = rejectionReason
  }

  let data = {
    id: id,
    approval: approval,
    rejectionReason: rejectionReason
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowdispersals/${id}`, {
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

export const deleteCowDispersal = async (cowDispersalID: any, onSuccess: () => void, onError: (error: string) => void) => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowdispersals/${cowDispersalID}`, options)
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