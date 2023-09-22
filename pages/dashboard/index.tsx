import HomeContent from "@/components/templates/dashboard/home/HomeContent";
import Master from "@/layouts/BaseLayout/master";
import { FARM_LEAD_ROLE, FARM_STAFF_ROLE, MetaProps } from "@/types/Common";
import { getSession } from 'next-auth/react';
import { getData as getTotalFarmCows } from "pages/api/totalFarmCows";
import { VIEW_ALL_COW_BANKS, VIEW_COW_BANKS } from "@/permissions/Permissions";

const metaProp: MetaProps = {
  title: 'Dashboard',
  description: 'Welcome to next tokyo dashboard'
}

function Home(props) {
  return (
    <>
      <HomeContent
        totalFarmCows={props.total_farm_cows}
        showTotalFarmCows={props.show_total_farm_cows}
      />
    </>
  );
};

Home.getLayout = (page: any) => (
  <Master
    metaProps={metaProp}
  >
    {page}
  </Master>
);

export default Home;

export async function getServerSideProps(context: any) {

  const session: any = await getSession(context);
  const userPermissions: any = session?.currentUser?.permissions;
  const userFarmRole: any = session?.currentUser?.farm_role;
  let total_farm_cows: any = [];

  let filterTotalFarmCow: boolean = true;
  let showTotalFarmCow: boolean = false;

  if (userPermissions.includes(VIEW_ALL_COW_BANKS)) {
    filterTotalFarmCow = false;
    showTotalFarmCow = true
  }else if(userFarmRole == FARM_LEAD_ROLE){
    filterTotalFarmCow = true;

    if (userPermissions.includes(VIEW_COW_BANKS)) {
      showTotalFarmCow = true
    }
  }else{
    showTotalFarmCow = false;
  }

  if(showTotalFarmCow){
    total_farm_cows = await getTotalFarmCows({ req: context.req, filterCountry: filterTotalFarmCow, filterFarm: filterTotalFarmCow });
  }

  return {
    props: {
      total_farm_cows: JSON.parse(JSON.stringify(total_farm_cows)),
      show_total_farm_cows: showTotalFarmCow
    }
  }
}