import { Typography, styled, Avatar, Alert, Box, FormHelperText, FormControl, IconButton, Tooltip } from "@mui/material"
import { useTranslation } from "next-i18next";
import { useDropzone } from "react-dropzone";
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

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
  height: 200,
  padding: 4,
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

interface inputProps {
  onUpload: (file: File) => void,
  hasError?: boolean,
  errorMessage?: any,
  disabled?: boolean,
}

const MultipleFiles = (
{
  onUpload,
  hasError = false,
  errorMessage = '',
}: inputProps
) => {

  const { t }: { t: any } = useTranslation();
  const [images, setImages] = useState<any>([]);
  // const [disabled, setDisabled] = useState(false);

  //disable react dropzone when file is uploaded
  useEffect(() => {
    if (images.length > 0) {
      onUpload(images);
    }
  }
  , [images]);

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
      'image/*': ['.jpeg', '.png']
    },
    onDrop: (acceptedFiles) => {
      if(images.length < 0) {
        setImages( acceptedFiles.map(image => Object.assign(image, {
          preview: URL.createObjectURL(image)
        })));
      }
      else {
        setImages( [...images, ...acceptedFiles.map(image => Object.assign(image, {
          preview: URL.createObjectURL(image)
        }))]);
      }
    }
  });



  const thumbs = images.map((image:any) => (
    <div style={thumb} key={image.name}>
      <div style={thumbInner}>
        <img
          src={image.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(image.preview) }}
        />
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

  const remove = (image:any) => {
    images.splice(images.indexOf(image), 1)
    setImages(images)
    onUpload(images);
  };

  return (
    <FormControl
    error={hasError} 
    >
      <Box>
        <>
        <Box display = 'flex'>
          <Box sx={{py:5, px:10 , border: '1px dashed grey' }} {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragAccept && (
              <>
                <AvatarSuccess variant="rounded" sx={{ ml:8 }}>
                  <CheckTwoToneIcon />
                </AvatarSuccess>
                <Typography
                  sx={{
                    mt: 2
                  }}
                >
                  {t('Drop the files to start uploading')}
                </Typography>
              </>
            )}
            {isDragReject && (
              <>
                <AvatarDanger variant="rounded" sx={{ ml:8 }}>
                  <CloseTwoToneIcon/>
                </AvatarDanger>
                <Typography
                  sx={{
                    mt: 2
                  }}
                >
                  {t('Does not meet the file requirements')}
                </Typography>
              </>
            )}
            {!isDragActive && (
              <>
                <CloudUploadTwoToneIcon 
                fontSize="large"
                sx={{ ml:7 }}
                />
                <Typography
                sx={{ ml:1 }}
                >
                  {t('Drag & drop the file here')}
                </Typography>
              </>
            )}
          </Box>
        </Box>
        </>
        {images.length > 0 && (
          <>
          <Alert
          sx={{
            mt: 2
          }}
          severity="success"
        >
          {t('You have uploaded')} <b>{images.length}</b> {t('file')}!
        </Alert>
        <aside style={thumbsContainer}>
          {thumbs}
        </aside>
        </>
        )}
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

export default MultipleFiles