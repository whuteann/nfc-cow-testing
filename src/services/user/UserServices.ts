import { IUser } from "@/models/User";
import { encodeQueryData, safeParse } from "@/helpers/app";
import { Paginate, PaginationType } from "@/types/Common";
import {
  compressImg,
  deleteFileHelper,
  uploadFileHelper,
} from "@/helpers/S3Helper";
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from "@prisma/client";
import image from "next/image";

const directory = "users"

export const paginate = async (query: object, onSuccess: (data: PaginationType) => void, onError: (error: string) => void) => {
  const params = encodeQueryData({ ...query, paginate: true });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };
  
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/users` + params, option)
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

// Used in Family/Coordinator Forms to filter Coordinator and Supervisor for dropdown.
export const index = async (query: object, onSuccess: (data: Prisma.UserCreateInput[]) => void, onError: (error: string) => void) => {
  const params = encodeQueryData(query);

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/users`+ params, option)
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

export const show = async (id: string, onSuccess: (user: IUser) => void, onError: (error: string) => void, getPassword: boolean = false) => {

  const params = encodeQueryData({getPassword: getPassword});

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/users/${id}` + params, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      let result = await res.json();
      
      onSuccess(result.data);
    })
    .catch(error => {
      console.error(error)
      error.text().then((text: any) => onError(JSON.parse(text)));
    });
}

export const editPassword = async (values: any, onSuccess: (user: IUser) => void, onError: (error: string) => void) => {

  let oldPassword = ""
  let changedPasswordStatus = undefined
  const params = encodeQueryData({getPassword: true});

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/users/${values.id}` + params, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  })
  .then(async (res: any) => {
    if(!res.ok) {
      return Promise.reject(res);
    }
    let result = await res.json();
    changedPasswordStatus = result.data.changedPassword
    oldPassword = result.data.password
  }).catch(err=>{
    console.error(err);
    onError('Something went wrong getting user data');
  })

  const data = {
    password : values.confirmPassword,
    changedPassword: !changedPasswordStatus ? true : undefined
  }

  
  const isMatch = await bcryptjs.compare(values.oldPassword, oldPassword)
  
  if(isMatch) {
    await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/users/${values.id}`, {
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
      onSuccess(res);
    })
    .catch(error => {
      onError("Something went wrong.")
    });
  }
  else{
    onError('Old Password does not match with current password')
  }
}

const uploadImage = async(image:any ,fileName:any) => {
  const toUpload = await compressImg(image);
  const status = await uploadFileHelper(toUpload,fileName,directory)
  if (!status) {
    console.error("Error uploading the file, the file may be too large, 4mb max")
  }
}

//User CRUD
export const create = async ( values: any, onSuccess: (user: Prisma.UserCreateInput) => void, onError: (error: string) => void) => {


  let imageLink = ''
  if (values.image){
    imageLink = values.image
  }

  let countryIds = values?.countries?.map((country) => country?.id);
  let farmIds = values?.farms?.map((farm) => farm.id);

  //Upload user data into mongoDB
  let data = {
    id: values?.id,
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    password: values.password,
    role: values.role,
    farm_role: values.farm_role,
    team_lead: values.team_lead?.id,
    countryIds: countryIds,
    farmIds: farmIds,
    image: imageLink,
    status: values.status
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/users`, {
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

    onSuccess(res);
  })
  .catch(error => {
    error.text().then((text: any) => onError(JSON.parse(text)));
  });
}

export const edit = async (oldImage :any, values: any, onSuccess: (user: IUser) => void, onError: (error: string) => void) => {
  
  let image:any
  let imageLink = oldImage

  if (values.image){
    imageLink = values.image
  }
  else if (values.image === null){
    imageLink = ''
  }
  
  let countryIds = values?.countries?.map((country) => country?.id);
  let farmIds = values?.farms?.map((farm) => farm.id);

  let affectedFamilyIds = values?.affectedFamilies?.map((family) => family?.id);
  let newCoordinatorIds = values?.new_coordinators?.map((coordinator) => coordinator?.id);

  //Put Data into MongoDB
  let data = {
    id : values.id,
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    password: values.password,
    role: values.role,
    farm_role: values.farm_role,
    team_lead: values.team_lead?.id,
    countryIds: countryIds,
    farmIds: farmIds,
    image: imageLink,
    new_coordinators: newCoordinatorIds || [],
    affected_families: affectedFamilyIds || [],
    status: values.status
  }

  const option = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  }

  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/users/${values.id}`, option)
    .then(async (res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      // if (typeof values.image === 'object' &&  values.image !== null)
      // {
      //   //Delete Old Image from AWS S3
      //   if(oldImage){
      //     deleteFileHelper(oldImage)
      //   }
      //   //Upload Image into AWS S3
      //   await uploadImage(image ,fileName)
        
      // }

      // //Delete Image if image link is empty
      // else if (imageLink === '' && oldImage != '')
      // {
      //   deleteFileHelper(oldImage)
      // }

      onSuccess(res);
    })
    .catch(error => {
      error.text().then((text: any) => {
        onError(JSON.parse(text));
      });
    });
  }

export const deleteUser = async (id: string, image:string, onSuccess: (user: Prisma.UserCreateInput) => void, onError: (error: string) => void) => {
  await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  })
    .then((res: any) => {
      if(!res.ok) {
        return Promise.reject(res);
      }

      if (image != '') {
        deleteFileHelper(image)
      }

      onSuccess(res);
    })
    .catch(error => {
      error.text().then((text: any) => onError(JSON.parse(text)));
    });

}

export const getWithIds = async (userIds: Array<string>) => {

  const params = encodeQueryData({
    userIds: userIds,
  });

  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  };

  return await fetch(`${process.env.NEXT_PUBLIC_PUBLIC_URL}/api/users/ids` + params, option)
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