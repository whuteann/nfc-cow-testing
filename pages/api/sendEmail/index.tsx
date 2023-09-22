
import { approvalEmail as sendCowSaleApprovalEmail } from "../cowFarmSaleRequests/[id]";
import { approvalEmail as sendFamilyTransferApprovalEmail } from "../familyTransferRequests/[id]";
import { approvalEmail as sendFamilyFarmTransferApprovalEmail } from "../familyFarmTransferRequests/[id]";
import { approvalEmail as sendCowPurchaseApprovalEmail } from "../cowPurchaseRequests/[id]";
import { approvalEmail as sendCowDeathApprovalEmail } from "../cowDeaths/[id]";
//types
const COW_FARM_SALE_APPROVAL_TYPE = 'cow-farm-sale-approval'; //63f31a74636d2c40537d13a2
const FAMILY_TRANSFER_APPROVAL_TYPE = 'family-transfer-approval'; //63fdcdd93e34c63da47433dc
const FAMILY_FARM_TRANSFER_APPROVAL_TYPE = 'family-farm-transfer-approval'; //640af39d499f755381d9959d
const COW_PURCHASE_APPROVAL_TYPE = 'cow-purchase-approval'; //64071d7aa4b1b18e94cb4aae
const COW_DEATH_APPROVAL_TYPE = 'cow-death-approval'; //63fd9f3d2a28fe1aea6316cc

const token = process.env.NEXT_PUBLIC_EMAIL_TOKEN

interface approvalEmailProps {
  id: string,
  status: string,
  rejectedReason?: string,
}

export default async function handler(req: any, res: any) {

  if (req.body.token != token) return res.status(422).send({ message: "Invalid Token." });

  switch (req.method) {
    case "POST":
      return post(req, res);

    default:
      res.status(405).send({ message: "Invalid Method." });
      return;
  }
}

const post = async (req: any, res: any) => {
  const { type, data } = req.body;

  switch (type) {
    case COW_FARM_SALE_APPROVAL_TYPE:
      await sendEmailCowFarmSaleApproval(data, res);
      break;
    case FAMILY_TRANSFER_APPROVAL_TYPE:
      await sendEmailFamilyTransferApproval(data, res);
      break;
    case FAMILY_FARM_TRANSFER_APPROVAL_TYPE:
      await sendEmailFamilyFarmTransferApproval(data, res);
      break;
    case COW_PURCHASE_APPROVAL_TYPE:
      await sendEmailCowPurchaseApproval(data, res);
      break;
    case COW_DEATH_APPROVAL_TYPE:
      await sendCowDeathApproval(data, res);
      break;
  }
}

const sendEmailCowFarmSaleApproval = async (data: approvalEmailProps, res: any) => {
  await sendCowSaleApprovalEmail(data).then(() => {
    return res.status(200).json({ message: "Success." })
  }).catch(err => {
    return res.status(400).json({ message: err.toString() })
  });
}

const sendEmailFamilyTransferApproval = async (data: approvalEmailProps, res: any) => {
  await sendFamilyTransferApprovalEmail(data).then(() => {
    return res.status(200).json({ message: "Success." })
  }).catch(err => {
    return res.status(400).json({ message: err.toString() })
  });
}

const sendEmailFamilyFarmTransferApproval = async (data: approvalEmailProps, res: any) =>{
  await sendFamilyFarmTransferApprovalEmail(data).then(() => {
    return res.status(200).json({ message: "Success." })
  }).catch(err => {
    return res.status(400).json({ message: err.toString() })
  });
}

const sendEmailCowPurchaseApproval = async (data: approvalEmailProps, res: any) =>{
  await sendCowPurchaseApprovalEmail(data).then(() => {
    return res.status(200).json({ message: "Success." })
  }).catch(err => {
    return res.status(400).json({ message: err.toString() })
  });
}

const sendCowDeathApproval = async (data: approvalEmailProps, res: any) =>{
  await sendCowDeathApprovalEmail(data).then(() => {
    return res.status(200).json({ message: "Success." })
  }).catch(err => {
    return res.status(400).json({ message: err.toString() })
  });
}