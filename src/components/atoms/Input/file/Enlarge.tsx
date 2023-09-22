import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

interface inputProps {
  image: string;
}

const EnlargeImage = (
  {
    image
  }: inputProps
) => {
  
  const [isOpen , setIsOpen] = useState(false);

  useEffect(() => {
    const body = document.querySelector('body');
    body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen])

  return (
    <div>
    <Button
      sx={{
        mt: 1,
        px: 3
      }}
      color="primary"
      onClick={() => {setIsOpen(true)}}
      size="large"
      variant="contained"
    >
      {('Enlarge')}
    </Button>

    {isOpen && (
      <Lightbox
        mainSrc={image}
        onCloseRequest={() => setIsOpen(false)}
      />
    )}
  </div>
  )
}

export default EnlargeImage