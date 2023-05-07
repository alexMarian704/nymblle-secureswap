import { Box } from '@chakra-ui/react';
import { FC } from 'react';

interface NFTComponentProps {

}

export const NFTComponent: FC<NFTComponentProps> = ({ }) => {
    return (
        <div className='nftComponent'>
            <div>
                <img src="https://ipfs.io/ipfs/bafybeibimqon4pjm54x27n6we5qohx57gd6n2mnbkxu2r6nejp3nbenk7u/38.png" alt="" />
            </div>
            <h3>FACES-dd0aec-0164</h3>
        </div>
    );
};