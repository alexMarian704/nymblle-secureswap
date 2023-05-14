import { Box } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { EGLDComponent } from './EGDLComponent';
import { NFTComponent } from './NFTComponent';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { Address, AddressValue, ContractFunction, ResultsParser, SmartContract } from '@multiversx/sdk-core/out';
import { useAccount } from '@useelven/core';

interface SwapProps {

}

export const Swap: FC<SwapProps> = ({ }) => {
    const { address: userAddress } = useAccount();
    const [userType, setUserType] = useState(0)

    const getUserType = async () => {
        const apiProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com")

        const contractAddress = new Address("erd1qqqqqqqqqqqqqpgqcvp6jd8c8skujd24x974xam203lzwstpn60qu5hx9q")
        let contract = new SmartContract({ address: contractAddress })

        const address = Address.fromBech32('erd1qqqqqqqqqqqqqpgqcvp6jd8c8skujd24x974xam203lzwstpn60qu5hx9q');

        let query = contract.createQuery({
            func: new ContractFunction("getSwap"),
            args: [new AddressValue(address)],
            caller: new Address(userAddress)
        });

        let resultsParser = new ResultsParser()

        let queryResponse = await apiProvider.queryContract(query)
        let bundle = resultsParser.parseUntypedQueryResponse(queryResponse);

        console.log(decodeSwapData(bundle.values[0]))
        // if(senderAddress === userAddress){
        //     console.log("e sender")
        // }else{
        //     console.log("ceererer")
        // }

    }

    function decodeSwapData(uint8Array: any) {
        let offset = 0;

        function readAddress() {
            const addressLength = 32;
            const addressBytes = uint8Array.slice(offset, offset + addressLength);
            offset += addressLength;
            return toHexString(addressBytes);
        }

        function readTokenIdentifier() {
            const tokenIdentifierLength = 20;
            const tokenIdentifierBytes = uint8Array.slice(offset, offset + tokenIdentifierLength);
            offset += tokenIdentifierLength;
            return toHexString(tokenIdentifierBytes);
        }

        function readU64() {
            const u64Length = 8;
            const u64Bytes = uint8Array.slice(offset, offset + u64Length);
            const u64Value = new DataView(u64Bytes.buffer).getBigUint64(0, false);
            offset += u64Length;
            return u64Value;
        }

        function readBool() {
            const boolValue = Boolean(uint8Array[offset]);
            offset += 1;
            return boolValue;
        }

        function toHexString(uint8Array: Uint8Array) {
            return Array.from(uint8Array)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        }

        const sender = readAddress();
        const receiver = readAddress();
        const nft_id = readTokenIdentifier();
        const nft_nonce = readU64();
        const sender_approvement = readBool();
        const receiver_approvement = readBool();

        return {
            sender,
            receiver,
            nft_id,
            nft_nonce,
            sender_approvement,
            receiver_approvement,
        };
    }

    const getNFTs = async () => {
        const response = await fetch("https://devnet-api.multiversx.com/accounts/erd1lpg4rqgeshusq0n73zzflwkzs0f6mxr6kt3ttx2v7mqktcxyn60qghnw70/nfts")
        const data = await response.json();
        console.log(data);
    }

    return (
        <Box
            height="330px"
            background="rgba(12,12,12,0.4)"
            borderRadius="7px"
            border="1px solid rgb(110,110,110)"
            width="calc(550px + 1vw)"
            margin="auto"
            marginTop="50px"
            sx={{
                '@media screen and (max-width: 590px)': {
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
                    <div className='displayGrid'>
                        <EGLDComponent />
                    </div>
                </div>
                <div className='inputContainer'>
                    <h2>You receive <i className="bi bi-arrow-bar-down" style={{
                        color: "#00e673",
                        fontSize: "calc(22px + 0.1vw)",
                    }}></i></h2>
                    <div className='displayGrid'>
                        <NFTComponent />
                    </div>
                </div>
            </div>
            <div className='buttonsContainer'>
                <button onClick={getUserType} className="deployModalButton" style={{
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