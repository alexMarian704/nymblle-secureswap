import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';
import { CreateModal } from './CreateModal';

interface NewSwapProps {
}

export const NewSwap: FC<PropsWithChildren<NewSwapProps>> = ({ }) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <Box
            height="300px"
            background="rgba(12,12,12,0.4)"
            borderRadius="7px"
            border="1px solid rgb(110,110,110)"
            width="calc(450px + 1vw)"
            margin="auto"
            marginTop="50px"
            sx={{
                '@media screen and (max-width: 500px)': {
                    width: "95%",
                },
            }}
        >
            <Flex flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                <button style={{
                    borderRadius:"50vh",
                    height:"calc(80px + 0.6vw)",
                    display:"grid",
                    placeContent:"center"
                }} onClick={onOpen}>
                    <i className="bi bi-plus-circle icon-hover"
                        style={{
                            fontSize: "calc(80px + 0.6vw)",
                        }}
                    ></i>
                </button>
            </Flex>
            <CreateModal isOpen={isOpen} onClose={onClose} />
        </Box>
    );
};
