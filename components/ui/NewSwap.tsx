import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { CreateModal } from './CreateModal';
import { useAccount } from '@useelven/core';

interface NewSwapProps {
}

interface NftsArray {
    identifier: string
    url: string
    fileType: string
}

export const NewSwap: FC<PropsWithChildren<NewSwapProps>> = ({ }) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [nftsArray, setNftsArray] = useState<NftsArray[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const { address } = useAccount();

    const getNFTs = async () => {
        const response = await fetch(`https://devnet-api.multiversx.com/accounts/${address}/nfts`)
        const data = await response.json();

        let nftsArray = [];
        for (let dataIndex = 0; dataIndex < data.length; dataIndex++) {
            const dataObject = data[dataIndex];
            if (dataObject.type === "NonFungibleESDT") {
                if (validURL(dataObject.url)) {
                    nftsArray.push({ identifier: dataObject.identifier, url: dataObject.url, fileType: dataObject.media[0].fileType })
                }
            }
        }
        setNftsArray(nftsArray)
        setLoading(false);
    }

    function validURL(str: string) {
        var pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i');
        return !!pattern.test(str);
    }

    useEffect(()=>{
        getNFTs();
    },[])

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
                    placeContent:"center",
                    outline:"none"
                }} onClick={onOpen}>
                    <i className="bi bi-plus-circle icon-hover"
                        style={{
                            fontSize: "calc(80px + 0.6vw)",
                        }}
                    ></i>
                </button>
            </Flex>
            <CreateModal isOpen={isOpen} onClose={onClose} nftsArray={nftsArray} loading={loading} />
        </Box>
    );
};
