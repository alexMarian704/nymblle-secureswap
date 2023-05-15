import { Box } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

interface NFTComponentProps {
    nftId:string;
}

export const NFTComponent: FC<NFTComponentProps> = ({ nftId }) => {
    const [nftUrl, setNftUrl] = useState("");

    const getNFTUrl = async () => {
        let cleanNftId = nftId.replace(/\f/g, '');
        const response = await fetch(`https://devnet-api.multiversx.com/nfts/${cleanNftId.trim()}`)
        const data = await response.json();
        console.log(data);
        setNftUrl(data.url);
    }

    useEffect(()=>{
        getNFTUrl();
    },[])

    return (
        <div className='nftComponent'>
            <div>
                <img src={nftUrl} alt="" />
            </div>
            <h3>{nftId.trim()}</h3>
        </div>
    );
};