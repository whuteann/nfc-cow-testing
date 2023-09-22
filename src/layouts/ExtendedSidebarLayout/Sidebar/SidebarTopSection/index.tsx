import { useRef, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Divider,
  alpha,
  List,
  ListItem,
  ListItemText,
  Popover,
  IconButton,
  Typography,
  styled,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import UnfoldMoreTwoToneIcon from '@mui/icons-material/UnfoldMoreTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { logout } from '@/services/auth/AuthServices';
import { useSession } from 'next-auth/react';

const MenuUserBox = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
    text-align: left;
    padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.sidebar.menuItemColor};
    display: block;

    &.popoverTypo {
      color: ${theme.palette.primary.main};
    }
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
    color: ${alpha(theme.sidebar.menuItemColor!, 0.6)};

    &.popoverTypo {
      color: ${theme.palette.primary.light};
    }
`
);

function SidebarTopSection() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const { data: session } = useSession();

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      handleClose();
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        mx: 2,
        pt: 1,
        position: 'relative'
      }}
    >
      <Avatar
        sx={{
          width: 68,
          height: 68,
          mb: 2,
          mx: 'auto'
        }}
        alt={(session as any)?.currentUser?.name!}
        src={(session as any)?.currentUser?.image!}
      >
        {(session as any)?.currentUser?.name![0]}
      </Avatar>

      <Typography
        variant="h4"
        sx={{
          color: `${theme.colors.alpha.trueWhite[100]}`
        }}
      >
        {(session as any)?.currentUser?.name}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: `${theme.colors.alpha.trueWhite[70]}`
        }}
      >
        {(session as any)?.currentUser?.email}
      </Typography>
      {/* <IconButton
        size="small"
        sx={{
          position: 'absolute',
          right: theme.spacing(0),
          color: `${theme.colors.alpha.trueWhite[70]}`,
          top: theme.spacing(0),
          background: `${theme.colors.alpha.trueWhite[10]}`,

          '&:hover': {
            color: `${theme.colors.alpha.trueWhite[100]}`,
            background: `${alpha(theme.colors.alpha.trueWhite[100], 0.2)}`
          }
        }}
        ref={ref}
        onClick={handleOpen}
      >
        <UnfoldMoreTwoToneIcon fontSize="small" />
      </IconButton>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
      >
        <MenuUserBox
          sx={{
            minWidth: 210
          }}
          display="flex"
        >
          <Avatar variant="rounded" alt={(session as any)?.currentUser?.name!} src={'/static/images/avatars/1.jpg'} />
          <UserBoxText>
            <UserBoxLabel className="popoverTypo" variant="body1">
              {(session as any)?.currentUser?.name!}
            </UserBoxLabel> 
            <UserBoxDescription className="popoverTypo" variant="body2">
              {(session as any)?.currentUser?.email!}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider
          sx={{
            mb: 0
          }}
        />
        <List
          sx={{
            p: 1
          }}
          component="nav"
        >
          <ListItem
            onClick={() => {
              handleClose();
            }}
            button
          >
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary={t('Profile')} />
          </ListItem>
        </List>
        <Divider />
        <Box m={1}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon
              sx={{
                mr: 1
              }}
            />
            {t('Sign out')}
          </Button>
        </Box>
      </Popover> */}
    </Box>
  );
}

export default SidebarTopSection;