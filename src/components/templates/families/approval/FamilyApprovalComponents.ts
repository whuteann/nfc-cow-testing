import * as Yup from 'yup';
import { addFamilySchema, familyData, initialValues } from '../form/FamilyComponents';

export interface familyApprovalData extends familyData {
  rejectionMessage: boolean,
  rejectionReason?: string,
}

export const familyApprovalSchema = (t: any) =>{
  // const baseFamilySchema = addFamilySchema(t);

  const familyApproval = Yup.object({
    rejectionMessage: Yup.bool(),
    rejectionReason: Yup.string().nullable()
    .when('rejectionMessage', {
      is: true,
      then: Yup.string().required(t("Enter Rejection Reason"))
    }),
  });

  return familyApproval;
}  

export const approvalInitialValues = (single_family: familyApprovalData)   => {
  
  return (
    {
      ...initialValues(single_family),
      rejectionMessage: false,
      rejectionReason: single_family?.rejectionReason || '',
    }
  )
}