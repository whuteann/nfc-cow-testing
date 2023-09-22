import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

import { AppConfig } from '@/utils/AppConfig';
import { MetaProps } from '@/types/Common';

const Meta = ({ title, description, canonical }: MetaProps) => {
  const router = useRouter();

  const defaultTitle = title ? title : process.env.APP_NAME;
  const defaultDescription = description ? description : process.env.APP_DESCRIPTION;
  const defaultCanonical = canonical ? canonical : process.env.APP_CANONICAL;

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
          key="viewport"
        />
        <link
          rel="apple-touch-icon"
          href={`${process.env.NEXT_PUBLIC_ENV == 'staging' ? `${router.basePath}/static/images/logo/icare-logo-orange.png`: `${router.basePath}/static/images/favicon/apple-touch-icon.png`}`}
          key="apple"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${process.env.NEXT_PUBLIC_ENV == 'staging' ? `${router.basePath}/static/images/logo/icare-logo-orange.png`: `${router.basePath}/static/images/favicon/favicon-32x32.png`}`}
          key="icon32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${process.env.NEXT_PUBLIC_ENV == 'staging' ? `${router.basePath}/static/images/logo/icare-logo-orange.png`: `${router.basePath}/static/images/favicon/favicon-16x16.png`}`}
          key="icon16"
        />
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_ENV == 'staging' ? `${router.basePath}/static/images/logo/icare-logo-orange.png`: `${router.basePath}/static/images/favicon/favicon.ico`}`}
          key="favicon"
        />
      </Head>
      <NextSeo
        title={defaultTitle}
        description={defaultDescription}
        canonical={defaultCanonical}
        openGraph={{
          title: defaultTitle,
          description: defaultDescription,
          url: defaultCanonical,
          locale: AppConfig.locale,
          site_name: AppConfig.site_name,
        }}
      />
    </>
  );
};

export default Meta;
