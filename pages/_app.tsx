import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { useNetworkSync } from '@useelven/core';
import { theme } from '../config/chakraTheme';
import { useEffect, useState } from 'react';
import "../style/global.css"

const NextJSDappTemplate = ({ Component, pageProps }: AppProps) => {
  useNetworkSync({
    chainType: process.env.NEXT_PUBLIC_MULTIVERSX_CHAIN,
    ...(process.env.NEXT_PUBLIC_MULTIVERSX_API
      ? { apiAddress: process.env.NEXT_PUBLIC_MULTIVERSX_API }
      : {}),
    ...(process.env.NEXT_PUBLIC_WC_PROJECT_ID
      ? { walletConnectV2ProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID }
      : {}),
  });
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }
  if (typeof window === 'undefined') {
    return <></>;
  } else {
    return (
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    );
  }
};

export default NextJSDappTemplate;
