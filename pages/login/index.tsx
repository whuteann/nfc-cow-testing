import Stranger from "@/layouts/BaseLayout/stranger";
import { MetaProps } from "@/types/Common";

import {
  Box,
  Card,
  Typography,
  Container,
  styled
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import LoginForm from "@/components/templates/auth/login/LoginForm";
import LoginLogo from "@/components/atoms/LoginLogo";

const metaProp: MetaProps = {
  title: 'Login',
  description: 'Log into next tokyo'
}

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
`
);

const TopWrapper = styled(Box)(
  () => `
  display: flex;
  width: 100%;
  flex: 1;
  padding: 20px;
`
);

const Login = () => {
  const { t }: { t: any } = useTranslation();

  return (
    <Stranger
      metaProps={metaProp}
    >
      <MainContent>
        <TopWrapper>
          <Container maxWidth="sm">
            <LoginLogo />
            <Card
              sx={{
                mt: 3,
                px: 4,
                pt: 5,
                pb: 3
              }}
            >
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1
                  }}
                >
                  {t('Sign in')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  {t('Fill in the fields below to sign into your account.')}
                </Typography>
              </Box>
              <LoginForm />
            </Card>
          </Container>
        </TopWrapper>
      </MainContent>
    </Stranger>
  );
};

export default Login;