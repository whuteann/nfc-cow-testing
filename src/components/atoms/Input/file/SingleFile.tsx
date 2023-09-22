import {Typography, styled, Avatar, Alert, Box, FormHelperText, IconButton, Tooltip, Stack, Button } from "@mui/material"
import { useTranslation } from "next-i18next";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useRef, useState } from "react";
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import FormControl from '@mui/material/FormControl';
import DeleteIcon from '@mui/icons-material/Delete';
import FormLabel from '@mui/material/FormLabel';
import Cropper, { Area, Point } from 'react-easy-crop'
import { Slider } from '@mui/material';
import getCroppedImg from "@/helpers/CropImage";

import pdfIcon from "public/static/images/favicon/pdf.png";

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const thumbsContainer = {
  display: 'flex',
  marginTop: 16
};

const thumb = {
  borderRadius: 2,
  border: '2px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 200,
  height: 'auto',
  padding: 4,
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  // overflow : 'ellipsis'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

const cropperContainer = {
  width: 450,
  padding: 20,
  border: '2px solid #000000',
};

const cropContainer = {
  width: 400,
  height: 400,
  background: 'white'
};

const sliderContainer = {
  width: 400,
  paddingTop: 10
};

interface inputProps {
  cropper?: boolean,
  shape?: string,
  onUpload: (file: File) => void,
  acceptPDF?: boolean, 
  hasError?: boolean,
  value?: any,
  label?:string
  errorMessage?: any,
  disabled?: boolean,
  required?: boolean,
  enablePreview?: boolean
}

const SingleFile = (
  {
    cropper = false,
    shape = "round",
    onUpload,
    hasError = false,
    errorMessage = 'Bad',
    acceptPDF = false,
    value,
    label,

    enablePreview = true,
  }: inputProps
) => {

  
  const { t }: { t: any } = useTranslation();
  const [images, setImages] = useState<any>([]);
  const [errors, setErrors] = useState("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  // const [disabled, setDisabled] = useState(false);

  //disable react dropzone when file is uploaded
  useEffect(() => {
    if (images.length > 0) {
      if(cropper==true){
        onUpload(croppedImage);
      }
      else {
        onUpload(images[0]);
      }
    }
  }
  , [croppedImage, images]);

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => images.forEach((image:any) => URL.revokeObjectURL(image.preview));
  }, []);

  const {
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: 
    {
      'image/*': acceptPDF ? ['.jpeg', '.png', ".pdf"]: ['.jpeg', '.png']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles, fileRejections) => {
      setErrors('');
      setCroppedImage(null);
      setImages(acceptedFiles.map(image => Object.assign(image, {
        preview: URL.createObjectURL(image)
      })));
      
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === "too-many-files") {
            setErrors(`Error: ${err.message}`);
          }

          if (err.code === "file-invalid-type") {
            setErrors(`Error: ${err.message}`);
          }
        });
      });
    }
  });

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage:any = await getCroppedImg(
        images[0].preview,
        croppedAreaPixels,
        0
      )
      const file = new File([croppedImage],images[0].name,{type: images[0].type});
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
      setCroppedImage(file)
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels])

  const cropImage = (images.map((image:any) => (  

    <Box display="flex" justifyContent="center" key = {image.name}>
      <div style = {cropperContainer}>
        <Box style = {cropContainer} className = 'relative'>
          <Cropper
            image = {image.preview}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape= {shape as "rect" | "round"}
            showGrid={false}
            // disableAutomaticStylesInjection = {true}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </Box>
        <Box style={sliderContainer}>
          <Slider
          size="small"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => setZoom(Number(zoom))}
          classes={{ root: "slider" }}
          />
        </Box>
        <Box display="flex" justifyContent="center">
          <Button variant="contained" onClick={showCroppedImage}>Confirm Image</Button>
        </Box>
      </div>
    </Box>
  )))
  
  const croppedthumbs = (images.map((image:any, index:any) => (
    <Box display ="flex" key={image.name}>
      <Box style={thumb} >
        <Box style={thumbInner} className = "break-words" display='flex' justifyContent='center'>
          <Stack>
            <img
              src={croppedImage?.preview}
              style={{
                border: '2px solid black',
                borderRadius: shape === "round" ? "50%" : "0%"
              }}
              // Revoke data uri after image is loaded
              onLoad={() => { URL.revokeObjectURL(image.preview) }}
            />
            <Box display='flex' justifyContent='center'>
                <p className="text-base pt-2 break-all">{image.name}</p>
              <Tooltip title={t('Delete File')} arrow>
                <IconButton color= 'error'  onClick={() => remove(index)} >
                  <DeleteIcon fontSize='medium'/>
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  )));

  const normalthumbs = images.map((image:any) => (
    <div style={thumb} key={image.name}>
      <div style={thumbInner}>
      {
      image.name.substring(image.name.lastIndexOf('.'), image.name.length) === '.pdf'
        ?
          <img
            src={pdfIcon.src}
            style={img}
            // Revoke data uri after image is loaded
            onLoad={() => { URL.revokeObjectURL(image.preview) }}
          />
        :
        <img
          src={image.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(image.preview) }}
        />
      }
        
      </div>
      <div>
        <p className="text-base">{image.name}</p>
        <Tooltip title={t('Delete File')} arrow>
          <IconButton color= 'error'  onClick={() => remove(image)} >
            <DeleteIcon fontSize='medium'/>
          </IconButton>
        </Tooltip>
      </div>
    </div>
  ));

  const remove = (file:any) => {
    // images.splice(images.indexOf(file), 1)
    setImages([]);
    onUpload(("" as any));
    setCroppedImage(null);
  };

  return (
    
    <FormControl
    error={hasError}
    fullWidth 
    >
      <Box>
        <FormLabel>{label}: </FormLabel>
        <Box sx={{py:1 , width: 1 }}> 
          <Box sx={{py:5, border: (hasError ? '1px dashed red' : '1px dashed grey') }} {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragAccept && (
              <>
                <Box display='flex' justifyContent='center'>
                  <AvatarSuccess variant="rounded">
                    <CheckTwoToneIcon />
                  </AvatarSuccess>
                </Box>
                <Box display='flex' justifyContent='center'>
                  <Typography
                    sx={{
                      mt: 2
                    }}
                  >
                    {t('Drop the image to start uploading')}
                  </Typography>
                </Box>
              </>
            )}
            {isDragReject && (
              <>
                <Box display='flex' justifyContent='center'>
                  <AvatarDanger variant="rounded">
                    <CloseTwoToneIcon/>
                  </AvatarDanger>
                </Box>
                    <Box display='flex' justifyContent='center'>
                    <Typography
                      sx={{
                        mt: 2,
                        color: 'red'
                      }}
                    >
                      {t('Does not meet the file requirements')}
                    </Typography>
                  </Box>
              </>
            )}
            {!isDragActive && (
              <>
                <Box display='flex' justifyContent='center'>
                  <CloudUploadTwoToneIcon 
                    fontSize="large"
                    sx = {{
                      color: hasError && 'red'
                    }}
                  />
                </Box>
                <Box display='flex' justifyContent='center'>
                  <Typography
                  sx={{ 
                    ml:1,
                    color: hasError && 'red'
                  }}
                  >
                    {acceptPDF ? ('Drag & drop the file here') : ('Drag & drop the image here')}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
        
        {
        images.length > 0 && (
          <>
          {cropper
            ?
            <>
              {croppedImage 
              ?
                <>
                  <Alert
                  sx={{
                    mt: 2
                  }}
                  severity="success"
                  >
                    {t('You have uploaded')} <b>{images.length}</b> {acceptPDF ? t('file') : t('image')}!
                  </Alert>
                  {enablePreview &&
                  <aside style={thumbsContainer}>
                    {croppedthumbs}
                  </aside>
                  }
              
                </>
              :
                <Box>
                  {cropImage}
                </Box>
              }
            </>
            :
            <>
              <Alert
                sx={{
                  mt: 2
                }}
                severity="success"
              >
                {t('You have uploaded')} <b>{images.length}</b> {acceptPDF ? t('file') : t('image')}!
              </Alert>
              {enablePreview &&
              <aside style={thumbsContainer}>
                {normalthumbs}
              </aside>
              }
            </>
          }
          </>
        )}
        {errors && <p className="text-red-600 text-sm py-2">{errors}</p>}
      </Box>
        {
          hasError
          ?
          <FormHelperText>{errorMessage}</FormHelperText>
          :
          <></>
        } 
    </FormControl>
  )
}

export default SingleFile