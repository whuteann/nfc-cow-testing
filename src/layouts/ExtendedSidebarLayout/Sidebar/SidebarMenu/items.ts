import AssignmentIndTwoToneIcon from '@mui/icons-material/AssignmentIndTwoTone';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { CREATE_COW_PURCHASE_REQUESTS, CREATE_FARM_BREEDING_RECORDS, CREATE_FARM_COW_SALES, CREATE_FAMILY_FARM_TRANSFER_REQUESTS, MANAGE_COUNTRIES, MANAGE_DISTRICTS, MANAGE_FARMS, MANAGE_TOWN_VILLAGES, MANAGE_USERS, REVIEW_COW_PURCHASE_REQUESTS, REVIEW_FAMILIES_COORDINATORS, REVIEW_FAMILY_COW_DISPERSALS, REVIEW_FARM_COW_SALES, REVIEW_FAMILY_FARM_TRANSFER_REQUESTS, TAG_FARM_BREEDING_RECORDS, VIEW_FAMILIES_COORDINATORS, VIEW_FAMILY_COW_DISPERSALS, VIEW_FARM_BREEDING_RECORDS, REVIEW_COW_DEATHS, VIEW_COW_DEATHS, REVIEW_FAMILY_TRANSFERS_REQUESTS, CREATE_FAMILY_TRANSFER_REQUESTS, CREATE_FAMILY_COW_DISPERSALS, ASSIGN_FAMILY_COW_DISPERSALS, VIEW_FAMILY_FARM_TRANSFER_REQUESTS } from '@/permissions/Permissions';

export interface MenuItem {
  link?: string;
  icon?: any;
  badge?: string;
  badgeTooltip?: string;
  permission?: string;
  permissions?: string[];

  items?: MenuItem[];
  name: string;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
  permissions?: string[];
}

const menuItems: MenuItems[] = [
  {
    heading: 'General',
    items: [
      {
        name: 'Dashboard',
        icon: DashboardIcon,
        items: [
          {
            name: 'Home',
            link: '/dashboard',
            badgeTooltip: 'Home'
          },
          // {
          //   name: 'Reports',
          //   link: '/dashboard/reports',
          //   badgeTooltip: 'Detail Report',
          //   items: [
          //     {
          //       name: 'Charts large',
          //       link: '/reports/charts-large'
          //     },
          //     {
          //       name: 'Charts small',
          //       link: '/reports/charts-small'
          //     },
          //     {
          //       name: 'Composed cards',
          //       link: '/reports/composed-cards'
          //     },
          //     {
          //       name: 'Grids',
          //       link: '/reports/grids'
          //     },
          //     {
          //       name: 'Icon cards',
          //       link: '/reports/icon-cards'
          //     },
          //     {
          //       name: 'Image cards',
          //       link: '/reports/image-cards'
          //     },
          //     {
          //       name: 'Lists large',
          //       link: '/reports/lists-large'
          //     },
          //     {
          //       name: 'Lists small',
          //       link: '/reports/lists-small'
          //     },
          //     {
          //       name: 'Navigation',
          //       link: '/reports/navigation'
          //     },
          //     {
          //       name: 'Profile cards',
          //       link: '/reports/profile-cards'
          //     },
          //     {
          //       name: 'Progress circular',
          //       link: '/reports/progress-circular'
          //     },
          //     {
          //       name: 'Progress horizontal',
          //       link: '/reports/progress-horizontal'
          //     },
          //     {
          //       name: 'Sparklines large',
          //       link: '/reports/sparklines-large'
          //     },
          //     {
          //       name: 'Sparklines small',
          //       link: '/reports/sparklines-small'
          //     },
          //     {
          //       name: 'Statistics',
          //       link: '/reports/statistics'
          //     }
          //   ]
          // }
        ]
      }
    ]
  },
  {
    heading: 'Management',
    permissions: [MANAGE_USERS, MANAGE_COUNTRIES, MANAGE_DISTRICTS, MANAGE_TOWN_VILLAGES, MANAGE_FARMS, VIEW_FAMILIES_COORDINATORS, REVIEW_FAMILIES_COORDINATORS],
    items: [
      {
        name: 'Users',
        icon: PeopleIcon,
        link: '/dashboard/users',
        permission: MANAGE_USERS
      },
      {
        name: 'Countries',
        icon: PublicIcon,
        link: '/dashboard/countries',
        permission: MANAGE_COUNTRIES
      },
      {
        name: 'Districts',
        icon: BorderAllIcon,
        link: '/dashboard/districts',
        permission: MANAGE_DISTRICTS
      },
      {
        name: 'Town/Villages',
        icon: LocationCityIcon,
        link: '/dashboard/townvillages',
        permission: MANAGE_TOWN_VILLAGES
      },
      {
        name: 'Cows',
        icon: LocationCityIcon,
        link: '/dashboard/cows',
        // permission: MANAGE_TOWN_VILLAGES (No Cows Permission atm)
      },
      {
        name: 'Farms',
        icon: AgricultureIcon,
        link: '/dashboard/farms',
        permission: MANAGE_FARMS
      },
      {
        name: 'Families',
        icon: FamilyRestroomIcon,
        permissions: [VIEW_FAMILIES_COORDINATORS, REVIEW_FAMILIES_COORDINATORS],
        items: [
          {
            name: 'Families',
            link: '/dashboard/families',
            permission: VIEW_FAMILIES_COORDINATORS
          },
          {
            name: 'Approvals',
            link: '/dashboard/families/approvals',
            permission: REVIEW_FAMILIES_COORDINATORS
          },
          {
            name: 'Rejected Families',
            link: '/dashboard/families/rejected',
            permission: VIEW_FAMILIES_COORDINATORS
          },
          {
            name: 'Family Tag Replacements',
            link: '/dashboard/families/tag-replacement',
            permission: VIEW_FAMILIES_COORDINATORS
          },
        ]
      },
      {
        name: 'Coordinators',
        icon: AssignmentIndTwoToneIcon,
        permissions: [VIEW_FAMILIES_COORDINATORS, REVIEW_FAMILIES_COORDINATORS],
        items: [
          {
            name: 'Coordinators',
            link: '/dashboard/coordinators',
            permission: VIEW_FAMILIES_COORDINATORS
          },
          {
            name: 'Approvals',
            link: '/dashboard/coordinators/approvals',
            permission: REVIEW_FAMILIES_COORDINATORS
          },
          {
            name: 'Rejected Coordinators',
            link: '/dashboard/coordinators/rejected',
            permission: VIEW_FAMILIES_COORDINATORS
          },
          {
            name: 'Coordinator Tag Replacements',
            link: '/dashboard/coordinators/tag-replacement',
            permission: VIEW_FAMILIES_COORDINATORS
          },
        ]
      },
      {
        name: 'Reports',
        icon: FamilyRestroomIcon,
        permissions: [VIEW_FAMILIES_COORDINATORS],
        items: [
          {
            name: '#1',
            link: '/dashboard/reports/1',
            permission: VIEW_FAMILIES_COORDINATORS
          },
          {
            name: '#2',
            link: '/dashboard/reports/2',
            permission: VIEW_FAMILIES_COORDINATORS
          },
          {
            name: '#3',
            link: '/dashboard/reports/3',
            permission: VIEW_FAMILIES_COORDINATORS
          },
          {
            name: '#4',
            link: '/dashboard/reports/4',
            permission: VIEW_FAMILIES_COORDINATORS
          },
          {
            name: '#5',
            link: '/dashboard/reports/5',
            permission: VIEW_FAMILIES_COORDINATORS
          },
          {
            name: '#6',
            link: '/dashboard/reports/6',
            permission: VIEW_FAMILIES_COORDINATORS
          },
        ]
      },
    ]
  },
  {
    heading: 'Processes',
    items: [
      {
        name: 'Cow Purchases',
        icon: ShoppingCartIcon,
        permissions: [CREATE_COW_PURCHASE_REQUESTS, REVIEW_COW_PURCHASE_REQUESTS],
        items: [
          {
            name: 'Cow Purchases',
            link: '/dashboard/cow-purchase-requests',
            permission: CREATE_COW_PURCHASE_REQUESTS
          },
          {
            name: 'Approvals',
            link: '/dashboard/cow-purchase-requests/approvals',
            permission: REVIEW_COW_PURCHASE_REQUESTS
          },
          {
            name: 'Rejected Cow Purchases',
            link: '/dashboard/cow-purchase-requests/rejected',
            permission: CREATE_COW_PURCHASE_REQUESTS
          }
        ]
      },
      {
        name: 'Cow Dispersals',
        icon: LocalShippingIcon,
        permissions: [VIEW_FAMILY_COW_DISPERSALS, REVIEW_FAMILY_COW_DISPERSALS, CREATE_FAMILY_COW_DISPERSALS, ASSIGN_FAMILY_COW_DISPERSALS],
        items: [
          {
            name: 'Cow Dispersals',
            link: '/dashboard/cow-dispersals',
            permissions: [VIEW_FAMILY_COW_DISPERSALS, CREATE_FAMILY_COW_DISPERSALS]
          },
          {
            name: 'Approvals',
            link: '/dashboard/cow-dispersals/approvals',
            permission: REVIEW_FAMILY_COW_DISPERSALS
          },
          {
            name: 'Assign Cows',
            link: '/dashboard/cow-dispersals/assign-cows',
            permission: ASSIGN_FAMILY_COW_DISPERSALS
          },
          {
            name: 'Rejected Cow Dispersals',
            link: '/dashboard/cow-dispersals/rejected',
            permissions: [VIEW_FAMILY_COW_DISPERSALS, CREATE_FAMILY_COW_DISPERSALS]
          },
        ]
      },
      {
        name: 'Cow Farm Sales',
        icon: AttachMoneyIcon,
        permissions: [REVIEW_FARM_COW_SALES, CREATE_FARM_COW_SALES],
        items: [
          {
            name: 'Cow Farm Sales',
            link: '/dashboard/cow-farm-sale-requests',
            permission: CREATE_FARM_COW_SALES
          },
          {
            name: 'Approvals',
            link: '/dashboard/cow-farm-sale-requests/approvals',
            permission: REVIEW_FARM_COW_SALES
          },
          {
            name: 'Rejected Cow Farm Sales',
            link: '/dashboard/cow-farm-sale-requests/rejected',
            permission: CREATE_FARM_COW_SALES
          },
        ]
      },
      {
        name: 'Family Farm Transfer',
        icon: AttachMoneyIcon,
        permissions: [REVIEW_FAMILY_FARM_TRANSFER_REQUESTS, CREATE_FAMILY_FARM_TRANSFER_REQUESTS, VIEW_FAMILY_FARM_TRANSFER_REQUESTS],
        items: [
          {
            name: 'Family To Farm Transfer',
            link: '/dashboard/family-farm-transfer-requests',
            permissions: [VIEW_FAMILY_FARM_TRANSFER_REQUESTS, CREATE_FAMILY_FARM_TRANSFER_REQUESTS]
          },
          {
            name: 'Approvals',
            link: '/dashboard/family-farm-transfer-requests/approvals',
            permission: REVIEW_FAMILY_FARM_TRANSFER_REQUESTS
          },
          {
            name: 'Rejected Family To Farm Transfer',
            link: '/dashboard/family-farm-transfer-requests/rejected',
            permissions: [VIEW_FAMILY_FARM_TRANSFER_REQUESTS, CREATE_FAMILY_FARM_TRANSFER_REQUESTS]
          },
        ]
      },
      {
        name: 'Farm Birth Records',
        icon: FavoriteIcon,
        link: '/dashboard/farm-birth-records',
        permissions: [CREATE_FARM_BREEDING_RECORDS, VIEW_FARM_BREEDING_RECORDS, TAG_FARM_BREEDING_RECORDS]
      },
      {
        name: 'Family Birth Records',
        icon: FavoriteIcon,
        link: '/dashboard/family-birth-records',
        permissions: [CREATE_FARM_BREEDING_RECORDS, VIEW_FARM_BREEDING_RECORDS, TAG_FARM_BREEDING_RECORDS]
      },
      {
        name: 'Cow Deaths',
        icon: HeartBrokenIcon,
        permissions: [VIEW_COW_DEATHS, REVIEW_COW_DEATHS],
        link: '/dashboard/cow-deaths' ,
        items: [
          {
            name: "Cow Deaths",
            link: '/dashboard/cow-deaths',
            permission: VIEW_COW_DEATHS
          },
          {
            name: "Approvals",
            link: '/dashboard/cow-deaths/approvals',
            permission: REVIEW_COW_DEATHS,
          },
          {
            name: "Rejected Cow Deaths",
            link: '/dashboard/cow-deaths/rejected',
            permission: VIEW_COW_DEATHS
          },
        ]
      },
      {
        name: 'Family Transfer',
        icon: FavoriteIcon,
        permissions: [CREATE_FAMILY_TRANSFER_REQUESTS, REVIEW_FAMILY_TRANSFERS_REQUESTS],
        items: [
          {
            name: 'Family Transfer Requests',
            link: '/dashboard/family-transfer-requests',
            permission: CREATE_FAMILY_TRANSFER_REQUESTS
          },
          {
            name: 'Approvals',
            link: '/dashboard/family-transfer-requests/approvals',
            permission: REVIEW_FAMILY_TRANSFERS_REQUESTS
          },
          {
            name: 'Rejected Family Transfer',
            link: '/dashboard/family-transfer-requests/rejected',
            permission: CREATE_FAMILY_TRANSFER_REQUESTS
          },
        ]
      },
    ]
  },
];

export default menuItems;
