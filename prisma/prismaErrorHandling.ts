import { Prisma } from '@prisma/client';

const getProperty = (property: any) => {
  try {
    if(Array.isArray(property)) {
      property = property[0];      
    }

    var filteredProperty = property.split("_");

    filteredProperty.shift();
    filteredProperty.pop();

    filteredProperty = filteredProperty.join(' ');
    filteredProperty = filteredProperty.replace(/[A-Z]/g, ' $&').trim();

    if(filteredProperty == '') {
      return property.replace(/_+/g, ' ');
    }

    return filteredProperty.charAt(0).toUpperCase() + filteredProperty.slice(1);
  } catch (e: any) {
    return property.replace(/_+/g, ' ');
  }
}

export const handlePrismaErrors = (e: any) => {
  let errorMessage = '';

  switch (true) {
    case e instanceof Prisma.PrismaClientKnownRequestError:
      errorMessage = handlePrismaKnownError(e);      
      break;

    case e instanceof Prisma.PrismaClientValidationError:
      errorMessage = handlePrismaValidationError(e);      
      break;

    default:
      errorMessage = e.data || 'Something went wrong. Please try again'
  }

  return errorMessage;
}

const handlePrismaKnownError = (e: any) => {
  let errorMessage = '';

  switch(e.code) {
    case 'P2002':
      errorMessage = getProperty(e.meta?.target) + ' must be unique';
      break;

    case 'P2003':
      errorMessage = getProperty(e.meta?.target) + ' foreign key constraint failed';
      break;

    case 'P2006':
      errorMessage = getProperty(e.meta?.target) + ' value is not valid';
      break;
  
    case 'P2012':
      errorMessage = getProperty(e.meta?.target) + ' value is required';
      break;

    case 'P2013':
      errorMessage = getProperty(e.meta?.target) + ' argument is required';
      break;

    default:
      errorMessage = 'Something went wrong. Please try again';
  }

  return errorMessage;
}

const handlePrismaValidationError = (e: any) => {
  // Can access via e.message but response is not beautiful)
  return 'Missing a required field';
}