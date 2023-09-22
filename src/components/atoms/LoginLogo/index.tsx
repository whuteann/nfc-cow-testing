import {
  styled,
} from '@mui/material';
import Link from 'src/components/atoms/Link';
import Image from 'next/image';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        justify-content: center;
`
);

interface logoProps {
  variant?: 'primary' | 'secondary'
}

function LoginLogo({
  variant = 'primary'
}: logoProps) {
  return (
    <LogoWrapper href="/">
      <Image src={ variant == 'primary' ? (process.env.NEXT_PUBLIC_ENV == 'staging' ? '/static/images/logo/icare-logo-orange.png' : '/static/images/logo/icare-logo.png') : '/static/images/logo/icare-logo-white.png' } alt="logo" width="100px" height="100px" /> 
    </LogoWrapper>
  );
}

export default LoginLogo;