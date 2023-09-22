import User from "@/models/User";
import { COORDINATOR_ROLE, SUPERVISOR_ROLE, TEAM_LEAD_ROLE } from "@/types/Common";

var mongoose = require('mongoose');

export const familyFilter = async (session: any, type: string, query: object) => {
  const user = session?.currentUser;
  let filter = {};
  var objectID = mongoose.Types.ObjectId(user?._id);

  switch (user?.role) {
    case TEAM_LEAD_ROLE:
      const supervisorsTiedWithTeamLead = await User.find({"team_lead": objectID}, "_id");
      const supervisorIds = supervisorsTiedWithTeamLead?.map((supervisor) => supervisor._id);

      if (type == "Family"){
        filter = {"coordinator.supervisor" : {$in : supervisorIds}};
      }
      else {
        filter = {"supervisor" : {$in : supervisorIds}};
      }
      break;

    case SUPERVISOR_ROLE:
      if (type == "Family"){
        filter = {"coordinator.supervisor" : objectID};
      }
      else {
        filter = {"supervisor" : objectID};
      }
      break;

    case COORDINATOR_ROLE:
      filter = {"coordinator._id" : objectID};
      break;

    default:
      break;    
  }

  return {
    ...query,
    ...filter
  };
}