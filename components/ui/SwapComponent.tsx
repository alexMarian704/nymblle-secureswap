import { Box } from '@chakra-ui/react';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { EGLDComponent } from './EGDLComponent';
import { NFTComponent } from './NFTComponent';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { Address, AddressValue, ContractFunction, ResultsParser, SmartContract } from '@multiversx/sdk-core/out';
import { useAccount } from '@useelven/core';

interface SwapProps {
    setError: Dispatch<SetStateAction<string>>
}

export const Swap: FC<SwapProps> = ({ setError }) => {
    const { address: userAddress } = useAccount();
    const [sender, setSender] = useState("");
    const [receiver, setReceiver] = useState("");
    const [receiverApprovement, setReceiverApprovement] = useState(false);
    const [senderApprovement, setSenderApprovement] = useState(false);
    const [loading, setLoading] = useState(true);
    const [nftId, setNftID] = useState("")
    const [nftNonce, setNftNonce] = useState("")

    const getUserType = async () => {
        const apiProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com")

        const contractAddress = new Address("erd1qqqqqqqqqqqqqpgqcvp6jd8c8skujd24x974xam203lzwstpn60qu5hx9q")
        let contract = new SmartContract({ address: contractAddress })

        let query = contract.createQuery({
            func: new ContractFunction("getSwap"),
            args: [new AddressValue(Address.fromBech32(userAddress))],
            caller: new Address(userAddress)
        });

        let resultsParser = new ResultsParser()

        let queryResponse = await apiProvider.queryContract(query)
        let bundle = resultsParser.parseUntypedQueryResponse(queryResponse);

        const decodeData = decodeSwapData(bundle.values[0]);
        //console.log(decodeSwapData(bundle.values[0]));

        const bech32AddressSender = Address.fromHex(decodeData.sender).bech32();
        const bech32AddressReceiver = Address.fromHex(decodeData.receiver).bech32();


        let queryNounce = contract.createQuery({
            func: new ContractFunction("getNftNonce"),
            args: [new AddressValue(Address.fromBech32(bech32AddressSender))],
            caller: new Address(userAddress)
        });

        let resultsParserNounce = new ResultsParser()
        let queryResponseNounce = await apiProvider.queryContract(queryNounce)
        let bundleNounce = resultsParserNounce.parseUntypedQueryResponse(queryResponseNounce);
        setNftNonce(bundleNounce.values[0].toString("hex"))


        setNftID(hexToReadableString(decodeData.nft_id))
        //console.log(hexToReadableString(decodeData.nft_id))
        setSender(bech32AddressSender);
        setReceiver(bech32AddressReceiver);
        setReceiverApprovement(decodeData.receiver_approvement);
        setSenderApprovement(decodeData.sender_approvement)
        setLoading(false)
    }

    const approveSwap = () => {

    }

    const claim = () => {

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

    function hexToReadableString(hex: string) {
        let result = '';
        for (let i = 0; i < hex.length; i += 2) {
            let charCode = parseInt(hex.substr(i, 2), 16);
            if (charCode > 0) {
                result += String.fromCharCode(charCode);
            }
        }
        return result;
    }


    const getNFTs = async () => {
        const response = await fetch("https://devnet-api.multiversx.com/accounts/erd1lpg4rqgeshusq0n73zzflwkzs0f6mxr6kt3ttx2v7mqktcxyn60qghnw70/nfts")
        const data = await response.json();
        console.log(data);
    }

    useEffect(() => {
        getUserType()
    }, [])

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
                {loading === false && <div className='inputContainer'>
                    <h2>You send <i className="bi bi-arrow-bar-up" style={{
                        color: "#00e673",
                        fontSize: "calc(22px + 0.1vw)",
                    }}></i></h2>
                    <div className='displayGrid'>
                        {(userAddress === receiver && receiver !== "") ? <EGLDComponent userAddress={userAddress} receiver={receiver} /> : <NFTComponent nftId={`${nftId}-${nftNonce}`} />}
                    </div>
                </div>}
                {loading === false && <div className='inputContainer'>
                    <h2>You receive <i className="bi bi-arrow-bar-down" style={{
                        color: "#00e673",
                        fontSize: "calc(22px + 0.1vw)",
                    }}></i></h2>
                    <div className='displayGrid'>
                        {(userAddress === receiver && receiver !== "") ? <NFTComponent nftId={`${nftId}-${nftNonce}`} /> : <EGLDComponent userAddress={userAddress} receiver={receiver} />}
                    </div>
                </div>}
            </div>
            {loading === false && <div className='buttonsContainer'>
                {((userAddress === sender && senderApprovement === true) && (userAddress === receiver && receiverApprovement === true)) && <h2 style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: "calc(19px + 0.1vw)",
                    marginBottom: "8px"
                }}>Swap has ended, please claim</h2>}
                {((userAddress === sender && senderApprovement === false) || (userAddress === receiver && receiverApprovement === false)) && <button onClick={getUserType} className="deployModalButton" style={{
                    marginBottom: "6px"
                }}><i className="bi bi-x-lg" style={{
                    color: "#ed2400",
                    fontSize: "calc(16px + 0.1vw)",
                    marginRight: "2px"
                }}></i>Cancel</button>}
                {((userAddress === sender && senderApprovement === false) || (userAddress === receiver && receiverApprovement === false)) && <button onClick={approveSwap} className="deployModalButton"><i className="bi bi-check-lg" style={{
                    color: "#00e673",
                    fontSize: "calc(19px + 0.1vw)",
                    marginRight: "2px"
                }}></i>Confirm swap</button>}
                {((userAddress === sender && senderApprovement === true) && (userAddress === receiver && receiverApprovement === true)) && <button onClick={claim} className="deployModalButton"><i className="bi bi-check2-all" style={{
                    color: "#00e673",
                    fontSize: "calc(19px + 0.1vw)",
                    marginRight: "2px"
                }}></i>Claim</button>}
            </div>}
        </Box>
    );
};