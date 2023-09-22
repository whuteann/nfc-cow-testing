export const uploadFileHelper = async (file:any, fileName:any, directory:any): Promise<boolean> => {
  const res = await fetch(
    `/api/amazonS3?file=${fileName}&dir=${directory}&type=${file.type}`,{method:'POST'}
  );

  const { url, fields } = await res.json();
  const formData = new FormData();
  Object.entries({ ...fields, file }).forEach(([key, value]:any) => {
    formData.append(key, value);
  });

  const upload = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    },
  });
  return upload.status === 204 || upload.status === 200;
  
};

export const downloadFileHelper = async (file:any, secondaryId: any, name: any) => {
  const baseImageURL = `${process.env.NEXT_PUBLIC_CLOUDFRONT_IMAGE_URL}/`
  const filePath = file.slice(baseImageURL.length);
  const type = filePath.substring(filePath.indexOf('.') + 1)
  const fileName = secondaryId + name +  "." + type 
  
  await fetch(`/api/amazonS3?file=${file}&fileName=${fileName}`, {
    method: 'GET',
    headers : {
      'Content-type' : 'application/json'
    },
  })
  .then( async (res: any) => {

    let result = await res.json()
    const link = document.createElement('a');
    link.href = result.url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return res.status

  })
  .catch((error: any) => {
    return error
  })
  
};

export const deleteFileHelper = async (file:any): Promise<boolean> => {

  const status = await fetch("/api/amazonS3", {
    method: 'DELETE',
    headers : {
      'Content-type' : 'application/json'
    },
    body : JSON.stringify({
      name : file,
    })
  })
  .then( (res: any) => {
    return res.status
  })
  .catch((error: any) => {
    return error
  })

  return status.status === 204 || status.status === 200;
  
};

export async function compressImg(file:any): Promise<any> {
  // compress file and return the new compressed file
  const compressedFile = await new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // const ctx = canvas.getContext('2d');
      // ctx.drawImage(img, 0, 0);
      let { width, height } = get_w_h(img);
      canvas.width = width;
      canvas.height = height;
      const ctx2 = canvas.getContext("2d");
      ctx2.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      const blob = dataURItoBlob(dataUrl);
      // convert blob to file
      const newFile = new File([blob], file.name, {
        type: file.type,
      });
      resolve(newFile);
    };
  });

  return compressedFile;

  function get_w_h(img: HTMLImageElement) {
    const MAX_WIDTH = 900;
    const MAX_HEIGHT = 630;
    let width = img.width;
    let height = img.height;
    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    return { width, height };
  }
}

function dataURItoBlob(dataURI:any) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}