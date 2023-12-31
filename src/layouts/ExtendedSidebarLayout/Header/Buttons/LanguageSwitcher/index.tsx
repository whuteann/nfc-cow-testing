import { useRef, useState } from 'react';

import {
  IconButton,
  Box,
  List,
  ListItem,
  Divider,
  Typography,
  ListItemText,
  alpha,
  Popover,
  Tooltip,
  styled,
  useTheme
} from '@mui/material';
import Text from 'src/components/atoms/Text';

import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import internationalization from 'src/i18n/i18n';
import { useTranslation } from 'react-i18next';

// import deFlag from 'country-flag-icons/3x2/DE.svg';
// import usFlag from 'country-flag-icons/3x2/US.svg';
// import esFlag from 'country-flag-icons/3x2/ES.svg';
// import frFlag from 'country-flag-icons/3x2/FR.svg';
// import cnFlag from 'country-flag-icons/3x2/CN.svg';
// import aeFlag from 'country-flag-icons/3x2/AE.svg';

const SectionHeading = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
        padding: ${theme.spacing(2, 2, 0)};
`
);

const ImageWrapper = styled('img')(
  () => `
        width: 30px;
`
);

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  border-radius: ${theme.general.borderRadiusLg};
`
);

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { t }: { t: any } = useTranslation();
  const getLanguage = i18n.language;
  const theme = useTheme();

  const switchLanguage = ({ lng }: { lng: any }) => {
    internationalization.changeLanguage(lng);
  };
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip arrow title={t('Language Switcher')}>
        <IconButtonWrapper
          color="secondary"
          ref={ref}
          onClick={handleOpen}
          sx={{
            mx: 1,
            background: alpha(theme.colors.error.main, 0.1),
            transition: `${theme.transitions.create(['background'])}`,
            color: theme.colors.error.main,

            '&:hover': {
              background: alpha(theme.colors.error.main, 0.2)
            }
          }}
        >
          {/* {getLanguage === 'de' && <ImageWrapper alt="German" src={deFlag.src} />}
          {getLanguage === 'en' && <ImageWrapper alt="English" src={usFlag.src} />}
          {getLanguage === 'en-US' && (
            <ImageWrapper alt="English" src={usFlag.src} />
          )}
          {getLanguage === 'en-GB' && (
            <ImageWrapper alt="English" src={usFlag.src} />
          )}
          {getLanguage === 'es' && <ImageWrapper alt="Spanish" src={esFlag.src} />}
          {getLanguage === 'fr' && <ImageWrapper alt="French" src={frFlag.src} />}
          {getLanguage === 'cn' && <ImageWrapper alt="Chinese" src={cnFlag.src} />}
          {getLanguage === 'ae' && <ImageWrapper alt="Arabic" src={aeFlag.src} />} */}
        </IconButtonWrapper>
      </Tooltip>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box
          sx={{
            maxWidth: 240
          }}
        >
          <SectionHeading variant="body2" color="text.primary">
            {t('Language Switcher')}
          </SectionHeading>
          <List
            sx={{
              p: 2
            }}
            component="nav"
          >
            <ListItem
              className={
                getLanguage === 'en' || getLanguage === 'en-US' ? 'active' : ''
              }
              button
              onClick={() => {
                switchLanguage({ lng: 'en' });
                handleClose();
              }}
            >
              {/* <ImageWrapper alt="English" src={usFlag.src} /> */}
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary="English"
              />
            </ListItem>
            <ListItem
              className={getLanguage === 'de' ? 'active' : ''}
              button
              onClick={() => {
                switchLanguage({ lng: 'de' });
                handleClose();
              }}
            >
              {/* <ImageWrapper alt="German" src={deFlag.src} /> */}
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary="German"
              />
            </ListItem>
            <ListItem
              className={getLanguage === 'es' ? 'active' : ''}
              button
              onClick={() => {
                switchLanguage({ lng: 'es' });
                handleClose();
              }}
            >
              {/* <ImageWrapper alt="Spanish" src={esFlag.src} /> */}
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary="Spanish"
              />
            </ListItem>
            <ListItem
              className={getLanguage === 'fr' ? 'active' : ''}
              button
              onClick={() => {
                switchLanguage({ lng: 'fr' });
                handleClose();
              }}
            >
              {/* <ImageWrapper alt="French" src={frFlag.src} /> */}
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary="French"
              />
            </ListItem>
            <ListItem
              className={getLanguage === 'cn' ? 'active' : ''}
              button
              onClick={() => {
                switchLanguage({ lng: 'cn' });
                handleClose();
              }}
            >
              {/* <ImageWrapper alt="Chinese" src={cnFlag.src} /> */}
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary="Chinese"
              />
            </ListItem>
            <ListItem
              className={getLanguage === 'ae' ? 'active' : ''}
              button
              onClick={() => {
                switchLanguage({ lng: 'ae' });
                handleClose();
              }}
            >
              {/* <ImageWrapper alt="Arabic" src={aeFlag.src} /> */}
              <ListItemText
                sx={{
                  pl: 1
                }}
                primary="Arabic"
              />
            </ListItem>
          </List>
          <Divider />
          <Text color="warning">
            <Box
              p={1.5}
              display="flex"
              alignItems="flex-start"
              sx={{
                maxWidth: 340
              }}
            >
              <WarningTwoToneIcon fontSize="small" />
              <Typography
                variant="body1"
                sx={{
                  pl: 1,
                  fontSize: theme.typography.pxToRem(12)
                }}
              >
                {t(
                  'We only translated a small part of the template, for demonstration purposes'
                )}
                !
              </Typography>
            </Box>
          </Text>
        </Box>
      </Popover>
    </>
  );
}

export default LanguageSwitcher;
