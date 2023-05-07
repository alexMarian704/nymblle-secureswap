import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { EGLDComponent } from './EGDLComponent';
import { NFTComponent } from './NFTComponent';

interface SwapProps {

}

export const Swap: FC<SwapProps> = ({ }) => {

    const getNFTs= async ()=>{
        const response = await fetch("https://devnet-api.multiversx.com/accounts/erd1lpg4rqgeshusq0n73zzflwkzs0f6mxr6kt3ttx2v7mqktcxyn60qghnw70/nfts")
        const data = await response.json();
        console.log(data);
    }

    return (
        <Box
            height="430px"
            background="rgba(12,12,12,0.4)"
            borderRadius="7px"
            border="1px solid rgb(110,110,110)"
            width="calc(550px + 1vw)"
            margin="auto"
            marginTop="50px"
            sx={{
                '@media screen and (max-width: 500px)': {
                    width: "97%",
                    height: "430px"
                },
            }}
            position="relative"
        >
            <div className='swapContainer'>
                <div className='inputContainer'>
                    <h2>You send <i className="bi bi-arrow-bar-up" style={{
                        color: "#00e673",
                        fontSize: "calc(22px + 0.1vw)",
                    }}></i></h2>
                    <EGLDComponent />
                </div>
                <div className='inputContainer'>
                    <h2>You receive <i className="bi bi-arrow-bar-down" style={{
                        color: "#00e673",
                        fontSize: "calc(22px + 0.1vw)",
                    }}></i></h2>
                    <NFTComponent />
                </div>
            </div>
            <div className='buttonsContainer'>
                <button onClick={getNFTs} className="deployModalButton" style={{
                    marginBottom: "6px"
                }}><i className="bi bi-x-lg" style={{
                    color: "#ed2400",
                    fontSize: "calc(16px + 0.1vw)",
                    marginRight: "2px"
                }}></i>Cancel</button>
                <button className="deployModalButton"><i className="bi bi-check-lg" style={{
                    color: "#00e673",
                    fontSize: "calc(19px + 0.1vw)",
                    marginRight: "2px"
                }}></i>Confirm swap</button>
            </div>
        </Box>
    );
};