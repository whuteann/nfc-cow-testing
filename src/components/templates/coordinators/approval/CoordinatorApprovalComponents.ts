import { Prisma } from '@prisma/client';
import * as Yup from 'yup';
import { addCoordinatorSchema, initialValues } from '../form/CoordinatorComponents';

export const coordinatorApprovalSchema = (t:any) =>{ 
  // const baseCoordinatorSchema = addCoordinatorSchema(t);

  const coordinatorApproval = Yup.object({
    rejectionMessage: Yup.bool(),
    rejectionReason: Yup.string().nullable()
    .when('rejectionMessage', {
      is: true,
      then: Yup.string().required(t("Enter Rejection Reason"))
    }),
  });

  return coordinatorApproval;
}

export const approvalInitialValues = (single_coordinator: Prisma.FamilyCreateInput)   => {

  return (
    {
      ...initialValues(single_coordinator),
      rejectionMessage: false,
      rejectionReason: single_coordinator?.rejectedReason || '',
    }
  )
}