import { IFamilyCoordinator } from "@/models/Family";
import { encodeQueryData, safeParse } from "@/helpers/app";
import { PaginationType } from "@/types/Common";
import { compressImg, deleteFileHelper, uploadFileHelper } from "@/helpers/S3Helper";
import { v4 as uuidv4 } from 'uuid';
import { IDistrict } from "@/models/District";
import { Prisma } from "@prisma/client";

const directory = "families"

export const paginate = async (query: object, onSuccess: (data: PaginationType) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({ ...query, paginate: true });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families` + params, option)
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

export const index = async (query: object, onSuccess: (data: Prisma.FamilyCreateInput[]) => void, onError: (error: string) => void) => {
  const params = encodeQueryData(query);

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families` + params, option)
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

// export const index = async (
//   status: any = undefined, 
//   country: any = undefined, 
//   type: any = undefined, 
//   townvillage: any = undefined, 
//   onSuccess: (data: IFamilyCoordinator[]) => void, onError: (error: string) => void) => {
//   const params = encodeQueryData({
//     status : status,
//     country: country,
//     type : type,
//     townvillage: townvillage
//   });
  
//   const option = {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   }

//   await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families`+ params, option)
//     .then(async (res: any) => {
//       if(!res.ok) {
//         return Promise.reject(res);
//       }

//       let result = await res.json();
      
//       onSuccess(result.data);
//     })
//     .catch(error => {
//     });
// }

export const familyAdvanceFilter = async (familyType: string, townVillage: string, name: string, onSuccess: (data: IFamilyCoordinator[]) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({
    familyType : familyType,
    townVillage: townVillage,
    name: name
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families/advance-filter-families${params}`, option)
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

export const familyFarmFilter = async (district: IDistrict, onSuccess: (data: IFamilyCoordinator[]) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({
    districtId: district._id
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families/family-farm-filter${params}`, option)
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

export const showSpecificFamilyCoordinator = async (id: string, onSuccess: (data: IFamilyCoordinator) => void, onError: (error: string) => void) => {

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families/${id}`, option)
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

const uploadImage = async (image:any, fileName:any) => {
  let toUpload = image;

  if(image.type !== "application/pdf" ){
    toUpload = await compressImg(image); 
  }

  const status = await uploadFileHelper(toUpload,fileName,directory)
  if (!status) {
    console.error("Error uploading the file, the file may be too large, 4mb max")
  }
}

export const addFamilyCoordinator = async (values: any, onSuccess: (coordinator: IFamilyCoordinator) => void, onError: (error: string) => void) => {
  let headshot: any;
  let housePhoto: any;
  let familyPhoto: any;
  let contractForm: any;
  let applicationForm: any;

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

  headshot = values.headshot
  housePhoto = values.housePhoto
  familyPhoto = values.familyPhoto

  applicationForm = processForm(values.applicationForm)

  if(values.contractForm != null){
    contractForm = processForm(values.contractForm)
  }


  let images = [headshot.value, housePhoto.value, familyPhoto.value, applicationForm.value]
  let fileNames = [headshot.name, housePhoto.name, familyPhoto.name, applicationForm.name]

  //Add contractForm if exists
  if(contractForm){
    images = [...images, contractForm.value]
    fileNames = [...fileNames, contractForm.name]
  }

  const overseeTownsVillageIds = values?.overseeTownsVillages?.map((townVillage) => townVillage?.id);
  
  //Upload user data into mongoDB
  const data: any = {
    type: values.type,
    status: values.status,
    rejectedReason: values.rejectedReason,
    coordinatorType: values.coordinatorType,
    supervisor: values.supervisor?.id,
    houseType: values.houseType,
    address: values.address,
    unionCouncil: values.unionCouncil,
    province: values.province,
    nearestFamousLandmard: values.nearestFamousLandmard,
    cityName: values.cityName,
    townVillage: values?.townVillage?.id,
    flatNumber: values.flatNumber,
    buildingName: values.buildingName,
    areaName: values.areaName,
    policeStationThanaName: values.policeStationThanaName,
    postOfficeName: values.postOfficeName,
    name: values.name,
    nfcID: values.nfcID? values.nfcID : '',
    nationalID: values.nationalID,
    notes: values.notes,
    contact: values.contact,
    religion: values.religion,
    headshot: headshot,
    overseeTownsVillages: overseeTownsVillageIds?.join(),
    coordinator: values.coordinator?.id,
    spouseName: values.spouseName,
    familyPhoto: familyPhoto,
    housePhoto: housePhoto,
    contractForm: contractForm ? contractForm.link : "",
    contractFormFilename: contractForm ? contractForm.type == ".pdf" ? contractForm.name : "" : "",
    applicationForm: applicationForm ? applicationForm.link: "",
    applicationFormFilename: applicationForm ? applicationForm.type == ".pdf" ? applicationForm.name : "" : "",
    typeOfAnimalAllowed: values.typeOfAnimalAllowed,
    noAnimalsAllocated: values.noAnimalsAllocated,
    children: values.children,
  }
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families`, {
    method: 'POST',
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
    // //Upload image into Amazon S3
    // await images.map(async(image:any,index:any) => {
    //   if(image && typeof image == 'object'){
    //     await uploadImage(image, fileNames[index])
    //   }
    // });

    onSuccess(res);
  })
  .catch(error => {
    console.error(error);
    error.text().then((text: any) => onError(JSON.parse(text)));

  });
}

export const updateFamilyCoordinatorNfc = async(
  id: string, values: any, onSuccess: (country: IFamilyCoordinator) => void, onError: (error: any) => void
) => {
  //Upload user data into mongoDB
  const data: any = {
    nfcID: values.nfcID,
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families/${id}/replacement`, {
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
    console.error(error)
    error.text().then((text: any) => onError(JSON.parse(text)));
  });
}

export const updateFamilyCoordinator = async (oldHeadshot:any, oldFamilyPhoto:any, oldHousePhoto:any, oldContractForm:any, oldApplicationForm:any, id: string, values: any, onSuccess: (country: IFamilyCoordinator) => void, onError: (error: any) => void) => {
  //After edit rejected families, change the status back to pending
  if(values.status === "Rejected"){
    values.status = "Pending"
  }

  let headshot:any
  let familyPhoto:any
  let housePhoto:any
  let applicationForm:any
  let applicationFormFilename:any
  let contractForm:any
  let contractFormFilename:any

  // let images:Array<any> = [];
  // let oldImages:Array<any> = [];
  // let fileNames:Array<any> = [];

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

  headshot = values.headshot
  familyPhoto = values.familyPhoto
  housePhoto = values.housePhoto

  applicationForm = processForm(values.applicationForm);
  if (values.contractForm){
    contractForm = processForm(values.contractForm);
  }

  const overseeTownsVillageIds = values?.overseeTownsVillages?.map((townVillage) => townVillage?.id);
  //Upload user data into mongoDB
  const data: any = {
    type: values.type,
    status: values.status,
    rejectedReason: values.rejectedReason,
    coordinatorType: values.coordinatorType,
    supervisor: values.supervisor?.id,
    houseType: values.houseType,
    address: values.address,
    unionCouncil: values.unionCouncil,
    province: values.province,
    nearestFamousLandmard: values.nearestFamousLandmard,
    cityName: values.cityName,
    townVillage: values?.townVillage?.id,
    flatNumber: values.flatNumber,
    buildingName: values.buildingName,
    areaName: values.areaName,
    policeStationThanaName: values.policeStationThanaName,
    postOfficeName: values.postOfficeName,
    name: values.name,
    nfcID: values.nfcID,
    nationalID: values.nationalID,
    notes: values.notes,
    contact: values.contact,
    religion: values.religion,
    headshot: headshot,
    overseeTownsVillages: overseeTownsVillageIds?.join(),
    coordinator: values.coordinator?.id,
    spouseName: values.spouseName,
    familyPhoto: familyPhoto,
    housePhoto: housePhoto,
    contractForm: contractForm?.link,
    // contractFormFilename: contractForm.name,
    contractFormFilename: contractForm ? contractForm?.type == ".pdf" ? contractForm?.name : "" : "",
    // applicationForm: applicationForm ? applicationForm.link: "",
    applicationForm: applicationForm.link,
    // applicationFormFilename: applicationForm.name,
    applicationFormFilename: applicationForm && applicationForm?.type == ".pdf" ? applicationForm?.name : "",
    typeOfAnimalAllowed: values.typeOfAnimalAllowed,
    noAnimalsAllocated: values.noAnimalsAllocated,
    children: values.children,
  }
    
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families/${id}`, {
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
    //Upload image into Amazon S3

    // await images.map(async(image:any, index:any) => {
    //   if(typeof image === 'object') {
    //     await deleteFileHelper(oldImages[index])
    //     await uploadImage(image, fileNames[index])
    //   }
    // })
    onSuccess(res);
  })
  .catch(error => {
    console.error(error)
    error.text().then((text: any) => onError(JSON.parse(text)));
  });

}

export const updateRequest = async (approval: any, id: any, values: any, onSuccess: (country: IFamilyCoordinator) => void, onError: (error: any) => void) => {
  const data: any = {
    status: approval == "Approved" ? "Approved" : "Rejected",
    rejectionReason: approval == "Approved" ? "" : values.rejectionReason
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families/approval/${id}`, {
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

export const deleteFamilyCoordinator = async (user: any, data: any, headshot: any, familyPhoto: any, housePhoto: any, onSuccess: () => void, onError: (error: string) => void) => {
  
  const deleteImageLink = "https://nfc-cow.s3.ap-southeast-1.amazonaws.com/families/"

  const deleteImages = [deleteImageLink + headshot.substring(46), deleteImageLink+ familyPhoto.substring(46), deleteImageLink + housePhoto.substring(46)]
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({user, data})
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families/${data._id}`, options)
    .then((res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }
      //Delete image from Amazon S3
      deleteImages.map(async(image:any) => {
        deleteFileHelper(image)
      })
      onSuccess();
    })
    .catch(error => {
      error.text().then((text: any) => onError(JSON.parse(text)));
    });
}

export const paginateDropdown = async (id: string, search: string, type: string, country: string, onSuccess: (data: any) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({
    id: id,
    name: search,
    type: type,
    country: country
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families/paginate-dropdown` + params, option)
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

export const getWithIds = async (familyIds: Array<string>) => {

  const params = encodeQueryData({
    familyIds: familyIds,
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  return await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/families/ids` + params, option)
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