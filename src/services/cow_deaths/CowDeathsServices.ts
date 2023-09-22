import { encodeQueryData } from '@/helpers/app';
import { compressImg, uploadFileHelper } from '@/helpers/S3Helper';
import { Paginate, PaginationType } from "@/types/Common";
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from "@prisma/client";
import { ICowDeath } from '@/models/Cow_Death';

const directory = "cow_deaths"

export const paginate = async (query: object, onSuccess: (data: PaginationType) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({...query, paginate: true});

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowDeaths` + params, option)
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

export const create = async (values: any, onSuccess: (record: any) => void, onError: (error: string) => void) =>{
  let cowPic: any;
  let report: any;

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

  cowPic = values.cowPic;
  report = processForm(values.report);

  let images = [cowPic.value, report.value]
  let fileNames = [cowPic.name, report.name]

  //upload data into mongoDB
  const data: any = {
    type: values?.type,
    option: values?.option,
    family: values?.family?.id,
    farm: values?.farm?.id,
    cow: values?.cow?.id,
    deathCause: values?.deathCause,
    dateOfDeath: values?.dateOfDeath,
    status: "Pending",
    rejectedReason: "",

    cowPic: cowPic,
    report: report.link,
    reportFilename: report.type == ".pdf" ? report.name : null,
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowDeaths/`, {
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

    //Lihao's solution
    // .then(await (res: any) => {
    //   if(!res.ok) {
    //     return Promise.reject(res);
    //   }
  
    //   //Upload image into Amazon S3
    //   await Promise.all(images.map(async(image:any,index:any) => {
    //     if(image && typeof image == 'object'){
    //       await uploadImage(image, fileNames[index])
    //     }
    //   }));

    //Upload image into Amazon S3
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

// export const edit = async (values: any, oldCowPicture:any, oldReport:any, _id:string, onSuccess: (request: any) => void, onError: (error: string) => void) =>{

//   let cow_picture:any;
//   let report:any;
  
//   let images:Array<any> = [];
//   let oldImages:Array<any> = [];
//   let fileNames:Array<any> = [];

//   const processImages = (value: any) => {
//     //Set same default value if image not changed (in url format)
//     if(typeof value != 'object'){
//       return {
//         value: value,
//         name: value,
//         link: value,
//       }
//     }

//     if(value.filename != undefined){
//       return false
//     }

//     //Process Image
//     let fileName: any = undefined;
//     let fileLink: any = undefined;

//     const imageName = value.name.substring(0, value.name.indexOf('.')).split(" ").join("")
//     const imageType = value.name.substring(value.name.indexOf('.') + 1)
//     fileName = imageName + "_" + uuidv4() + "." + imageType
//     fileLink = `${process.env.NEXT_PUBLIC_CLOUDFRONT_IMAGE_URL}/families/${fileName}`

//     return {
//       value: value,
//       name: fileName,
//       link: fileLink,
//     }
//   }

//   cow_picture = processImages(values.cow_pic);
//   if(cow_picture){
//     images = [...images, cow_picture.value];
//     oldImages = [...oldImages, oldCowPicture];
//     fileNames = [...fileNames, cow_picture.name];
//   }

//   report = processImages(values.report);
//   if(report){
//     images = [...images, report.value];
//     oldImages = [...oldImages, oldReport];
//     fileNames = [...fileNames, report.name];
//     report = report.value.type == "application/pdf" ? {filename: report.value.name, link: report.link} : report.link;
//   }

//   const data = {
//     ...values,
//     status: "Pending",
//     cow_pic: cow_picture,
//     report: report
//   }

//   await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowDeaths/${_id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//     },
//     body: JSON.stringify({data})
//   })
//   .then((res: any) => {
//     if(!res.ok) {
//       return Promise.reject(res);
//     }
//     //Upload image into Amazon S3
//     images.map(async(image:any, index:any) => {
//       if(typeof image === 'object') {
//         await deleteFileHelper(oldImages[index])
//         await uploadImage(image, fileNames[index])
//       }
//     })
//     onSuccess(res);
//   })
//   .catch(error => {
//     error.text().then((text: any) => onError(JSON.parse(text)));
//   });
// }



const uploadImage = async (image:any, fileName:any) => {
  let toUpload = image;

  if(image.type !== "application/pdf" ){
    toUpload = await compressImg(image); 
  }

  const status = await uploadFileHelper(toUpload, fileName, directory)
  if (!status) {
    console.error("Error uploading the file, the file may be too large, 4mb max")
  }
}

export const show = async (id: string, onSuccess: (cowDeath: ICowDeath) => void, onError: (error: string) => void) => {  
  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowDeaths/${id}`, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }
      
      let result = await res.json();
      
      onSuccess(result.data);
    })
    .catch(error => {
      console.error(error);
      error.text().then((text: any) => onError(JSON.parse(text)));
    });
}

export const editStatus = async (values: any, onSuccess: (result: any)=>void, onError: (err: any)=>void) =>{
  // if (values.approval === 'Approved') {
  //   values.status = "Approved"
  //   values.rejectionReason = ''
  // } 
  // else {
  //   values.status = "Rejected"
  //   values.rejectionReason = values.rejectionReason
  // }

  //Put Data into MongoDB
  let data = {
    id : values.id,
    status: values.approval,
    rejectedReason: values?.rejectedReason? values.rejectedReason : '',
    cow: values?.cow.id,
  }
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/cowDeaths/${values.id}`, {
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
    // let result = await res.json();
    onSuccess(res);
  })
  .catch(error => {
    console.error(error)
    error.text().then((text: any) => {
      onError(JSON.parse(text))
    });
  });
}