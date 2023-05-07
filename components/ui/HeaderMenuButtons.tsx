import { Box, Link } from '@chakra-ui/react';
import { FC } from 'react';
import { LoginModalButton } from '../tools/LoginModalButton';
import useWindowDimensions from '../../hooks/useWindowDimensions';

interface HeaderMenuButtonsProps {
  enabled: string[];
}

export const HeaderMenuButtons: FC<HeaderMenuButtonsProps> = ({ enabled }) => {
  const { width } = useWindowDimensions();

  return (
    <Box
      display="flex"
      gap={5}
      alignItems="center"
    >
      <Link href='https://nymblle.com/docs'
        fontSize="calc(18px + 0.1vw)"
        marginTop="3px"
        target="_blank"
      ><i className="bi bi-book"></i>{width > 800 ? " Docs" : ""}</Link>
      {enabled.includes('auth') && <LoginModalButton text={width > 630 ? " Connect" : ""} />}
    </Box>
  );
};
