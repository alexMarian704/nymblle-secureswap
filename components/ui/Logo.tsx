import NextLink from 'next/link';
import { Box, Text } from '@chakra-ui/react';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export const Logo = () => {
  const { width } = useWindowDimensions();

  return (
    <NextLink href="/">
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        position="relative"
        userSelect="none"
      >
        {/* <Text
          as="span"
          cursor="pointer"
          mb={0}
          fontSize="calc(27px + 0.3vw)"
          fontWeight="900"
          color="dappTemplate.white"
        >
          <i className="bi bi-shield-shaded" style={{
            color: "rgb(3, 111, 90)",
            marginRight: "7px"
          }}></i>{width > 630 ? "SecureSwap" : ""}
        </Text> */}
        {width <= 630 && <img style={{
          width:"calc(46px + 0.3vw)"
        }} src="./secureswap.png" alt="Secureswap logo" />}
        {width > 630 && <img style={{
          width:"calc(240px + 1vw)"
        }} src="./secureswap-logo-full.png" alt="Secureswap logo full" />}
      </Box>
    </NextLink>
  );
};
