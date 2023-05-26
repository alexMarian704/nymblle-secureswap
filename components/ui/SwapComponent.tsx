import { Box, Spinner } from '@chakra-ui/react';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { EGLDComponent } from './EGDLComponent';
import { NFTComponent } from './NFTComponent';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { Address, AddressValue, BooleanValue, ContractCallPayloadBuilder, ContractFunction, ResultsParser, SmartContract } from '@multiversx/sdk-core/out';
import { useAccount, useTransaction } from '@useelven/core';

interface SwapProps {
    setError: Dispatch<SetStateAction<string>>;
    setRefreshData: Dispatch<SetStateAction<boolean>>;
    refreshData: boolean;
}

export const Swap: FC<SwapProps> = ({ setError, setRefreshData, refreshData }) => {
    const { pending, triggerTx, transaction } = useTransaction();
    const { address: userAddress } = useAccount();
    const [sender, setSender] = useState("");
    const [receiver, setReceiver] = useState("");
    const [receiverApprovement, setReceiverApprovement] = useState(false);
    const [senderApprovement, setSenderApprovement] = useState(false);
    const [loading, setLoading] = useState(true);
    const [nftId, setNftID] = useState("")
    const [nftNonce, setNftNonce] = useState("")
    const [provided, setProvided] = useState(true);
    const [receiverHasVote, setReceiverHasVote] = useState(false);
    const [senderHasVote, setSenderHasVote] = useState(false);
    const [egldValue, setEgldValue] = useState("");

    const getUserType = async () => {
        const apiProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com")

        const contractAddress = new Address("erd1qqqqqqqqqqqqqpgq0wmlsr7zcpktfcgqk0wm4s2scyzjwmydn60qz8frzl")
        const contract = new SmartContract({ address: contractAddress })

        const query = contract.createQuery({
            func: new ContractFunction("getSwap"),
            args: [new AddressValue(Address.fromBech32(userAddress))],
            caller: new Address(userAddress)
        });

        const resultsParser = new ResultsParser()

        const queryResponse = await apiProvider.queryContract(query)
        const bundle = resultsParser.parseUntypedQueryResponse(queryResponse);

        const decodeData = decodeSwapData(bundle.values[0]);

        const bech32AddressSender = Address.fromHex(decodeData.sender).bech32();
        const bech32AddressReceiver = Address.fromHex(decodeData.receiver).bech32();


        const queryNounce = contract.createQuery({
            func: new ContractFunction("getNftNonce"),
            args: [new AddressValue(Address.fromBech32(userAddress))],
            caller: new Address(userAddress)
        });

        const resultsParserNounce = new ResultsParser()
        const queryResponseNounce = await apiProvider.queryContract(queryNounce)
        const bundleNounce = resultsParserNounce.parseUntypedQueryResponse(queryResponseNounce);

        setNftNonce(bundleNounce.values[0].toString("hex"))
        setNftID(hexToReadableString(decodeData.nft_id))
        setSender(bech32AddressSender);
        setReceiver(bech32AddressReceiver);
        getApprove(bech32AddressReceiver, bech32AddressSender)
        getVote(bech32AddressReceiver, bech32AddressSender)
        // setReceiverApprovement(decodeData.receiver_approvement);
        // setSenderApprovement(decodeData.sender_approvement)
        setLoading(false)
    }

    const getVote = async (receiverAddress: string, senderAddress: string) => {
        const apiProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com")
        const contractAddress = new Address("erd1qqqqqqqqqqqqqpgq0wmlsr7zcpktfcgqk0wm4s2scyzjwmydn60qz8frzl")
        const contract = new SmartContract({ address: contractAddress })
        const resultsParser = new ResultsParser()

        //----------------------------------------------//
        const queryReceiver = contract.createQuery({
            func: new ContractFunction("getReceiverApprovement"),
            args: [new AddressValue(Address.fromBech32(userAddress))],
            caller: new Address(userAddress)
        });
        const queryResponseReceiver = await apiProvider.queryContract(queryReceiver)
        const bundleReceiver = resultsParser.parseUntypedQueryResponse(queryResponseReceiver);
        if (bundleReceiver.values[0].toString("hex") === "01") {
            setReceiverApprovement(true);
        } else {
            setReceiverApprovement(false)
        }
        //----------------------------------------------//
        const querySender = contract.createQuery({
            func: new ContractFunction("getSenderApprovement"),
            args: [new AddressValue(Address.fromBech32(userAddress))],
            caller: new Address(userAddress)
        });
        const queryResponseSender = await apiProvider.queryContract(querySender)
        const bundleSender = resultsParser.parseUntypedQueryResponse(queryResponseSender);
        if (bundleSender.values[0].toString("hex") === "01") {
            setSenderApprovement(true);
        } else {
            setSenderApprovement(false);
        }
    }

    const getApprove = async (receiverAddress: string, senderAddress: string) => {
        const apiProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com")
        const contractAddress = new Address("erd1qqqqqqqqqqqqqpgq0wmlsr7zcpktfcgqk0wm4s2scyzjwmydn60qz8frzl")
        const contract = new SmartContract({ address: contractAddress })
        const resultsParser = new ResultsParser()

        //----------------------------------------------//
        const queryReceiver = contract.createQuery({
            func: new ContractFunction("getHasApproved"),
            args: [new AddressValue(Address.fromBech32(userAddress))],
            caller: new Address(userAddress)
        });
        const queryResponseReceiver = await apiProvider.queryContract(queryReceiver)
        const bundleReceiver = resultsParser.parseUntypedQueryResponse(queryResponseReceiver);
        if (bundleReceiver.values[0].toString("hex") === "01") {
            setReceiverHasVote(true);
        } else {
            setReceiverHasVote(false)
        }
        //----------------------------------------------//
        const querySender = contract.createQuery({
            func: new ContractFunction("getHasApproved"),
            args: [new AddressValue(Address.fromBech32(userAddress))],
            caller: new Address(userAddress)
        });
        const queryResponseSender = await apiProvider.queryContract(querySender)
        const bundleSender = resultsParser.parseUntypedQueryResponse(queryResponseSender);
        if (bundleSender.values[0].toString("hex") === "01") {
            setSenderHasVote(true);
        } else {
            setSenderHasVote(false);
        }
    }

    const approveSwap = () => {
        const contractAddress = 'erd1qqqqqqqqqqqqqpgq0wmlsr7zcpktfcgqk0wm4s2scyzjwmydn60qz8frzl'
        const func = new ContractFunction("approve")

        const data = new ContractCallPayloadBuilder()
            .setFunction(func)
            .setArgs([new BooleanValue(true)])
            .build();

        triggerTx({
            address: contractAddress,
            gasLimit: 80000000,
            value: 0,
            data,
        });
    }

    const claim = () => {
        const contractAddress = 'erd1qqqqqqqqqqqqqpgq0wmlsr7zcpktfcgqk0wm4s2scyzjwmydn60qz8frzl'
        const func = new ContractFunction("claim")

        const data = new ContractCallPayloadBuilder()
            .setFunction(func)
            .setArgs([])
            .build();

        triggerTx({
            address: contractAddress,
            gasLimit: 80000000,
            value: 0,
            data,
        });
    }

    const sendEgld = () => {
        const contractAddress = 'erd1qqqqqqqqqqqqqpgq0wmlsr7zcpktfcgqk0wm4s2scyzjwmydn60qz8frzl'
        const func = new ContractFunction("provide_tokens")

        const data = new ContractCallPayloadBuilder()
            .setFunction(func)
            .setArgs([])
            .build();

        if (Number(egldValue) > 0) {
            triggerTx({
                address: contractAddress,
                gasLimit: 80000000,
                value: Number(egldValue) * (10 ** 18),
                data,
            });
        } else {
            setError("Amount needs to be higher than 0")
        }
    }

    const cancel = () => {
        const contractAddress = 'erd1qqqqqqqqqqqqqpgq0wmlsr7zcpktfcgqk0wm4s2scyzjwmydn60qz8frzl'
        const func = new ContractFunction("approve")

        const data = new ContractCallPayloadBuilder()
            .setFunction(func)
            .setArgs([new BooleanValue(false)])
            .build();

        triggerTx({
            address: contractAddress,
            gasLimit: 80000000,
            value: 0,
            data,
        });
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
            const charCode = parseInt(hex.substr(i, 2), 16);
            if (charCode > 0) {
                result += String.fromCharCode(charCode);
            }
        }
        return result;
    }

    // const getNFTs = async () => {
    //     const response = await fetch("https://devnet-api.multiversx.com/accounts/erd1lpg4rqgeshusq0n73zzflwkzs0f6mxr6kt3ttx2v7mqktcxyn60qghnw70/nfts")
    //     const data = await response.json();
    //     console.log(data);
    // }

    useEffect(() => {
        if (transaction !== null) {
            setTimeout(() => {
                setRefreshData(!refreshData)
            }, 500)
        }
    }, [transaction])

    useEffect(() => {
        getUserType()
    }, [])

    useEffect(() => {
        if (transaction !== null) {
            getUserType()
        }
    }, [refreshData])

    //console.log(receiverHasVote, senderHasVote, receiverApprovement, senderApprovement, provided)
    // if(userAddress === sender)
    //     console.log("da")
    //console.log(userAddress, receiver, sender)

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
                        {(userAddress === receiver && receiver !== "") ? <EGLDComponent userAddress={userAddress} receiver={receiver} provided={provided} setProvided={setProvided} egldValue={egldValue} setEgldValue={setEgldValue} receiverHasVote={receiverHasVote} /> : <NFTComponent nftId={`${nftId}-${nftNonce}`} />}
                    </div>
                </div>}
                {loading === false && <div className='inputContainer'>
                    <h2>You receive <i className="bi bi-arrow-bar-down" style={{
                        color: "#00e673",
                        fontSize: "calc(22px + 0.1vw)",
                    }}></i></h2>
                    <div className='displayGrid'>
                        {(userAddress === receiver && receiver !== "") ? <NFTComponent nftId={`${nftId}-${nftNonce}`} /> : <EGLDComponent userAddress={userAddress} receiver={receiver} provided={provided} setProvided={setProvided} egldValue={egldValue} setEgldValue={setEgldValue} receiverHasVote={receiverHasVote} />}
                    </div>
                </div>}
            </div>
            {loading === false && <div className='buttonsContainer'>
                {((senderApprovement === true && receiverApprovement === true)) && <h2 style={{
                    width: "100%",
                    textAlign: "center",
                    fontSize: "calc(19px + 0.1vw)",
                    marginBottom: "8px"
                }}>Swap has ended, please claim</h2>}
                {((userAddress === sender && senderApprovement === false && senderHasVote === false) || (userAddress === receiver && receiverApprovement === false && receiverHasVote === false)) && <button onClick={cancel} className="deployModalButton" style={{
                    marginBottom: "6px"
                }}><i className="bi bi-x-lg" style={{
                    color: "#ed2400",
                    fontSize: "calc(16px + 0.1vw)",
                    marginRight: "2px"
                }}></i>Cancel</button>}
                {((userAddress === sender && senderApprovement === false && provided === true && senderHasVote === false) || (userAddress === receiver && receiverApprovement === false && provided === true && receiverHasVote === false)) && <button onClick={approveSwap} className="deployModalButton"><i className="bi bi-check-lg" style={{
                    color: "#00e673",
                    fontSize: "calc(19px + 0.1vw)",
                    marginRight: "2px"
                }}></i>Confirm swap</button>}
                {((userAddress === sender && senderApprovement === false && provided === false && senderHasVote === false)) && <button className="deployModalButton"><i className="bi bi-person-fill" style={{
                    color: "#00e673",
                    fontSize: "calc(19px + 0.1vw)",
                    marginRight: "2px"
                }}></i>Waiting for receiver</button>}
                {((userAddress === receiver && receiverApprovement === false && provided === false && receiverHasVote === false)) && <button onClick={sendEgld} className="deployModalButton"><i className="bi bi-check-lg" style={{
                    color: "#00e673",
                    fontSize: "calc(19px + 0.1vw)",
                    marginRight: "2px"
                }}></i>Send EGLD</button>}
                {((senderApprovement === true && receiverApprovement === true) || (userAddress === sender && senderHasVote === true && senderApprovement === false) || (userAddress === receiver && receiverHasVote === true && receiverApprovement === false)) && <button onClick={claim} className="deployModalButton"><i className="bi bi-check2-all" style={{
                    color: "#00e673",
                    fontSize: "calc(19px + 0.1vw)",
                    marginRight: "2px"
                }}></i>Claim your {((userAddress === sender && senderHasVote === true && senderApprovement === false) || (userAddress === receiver && receiverHasVote === true && receiverApprovement === true)) ? "NFT" : "EGLD"}</button>}
                {((userAddress === sender && senderApprovement === true && receiverHasVote === false)) && <button className="deployModalButton"><i className="bi bi-person-fill" style={{
                    color: "#00e673",
                    fontSize: "calc(19px + 0.1vw)",
                    marginRight: "2px"
                }}></i>Waiting for receiver</button>}
                {((senderApprovement === false && senderHasVote === false) && (userAddress === receiver && receiverApprovement === true)) && <button className="deployModalButton"><i className="bi bi-person-fill" style={{
                    color: "#00e673",
                    fontSize: "calc(19px + 0.1vw)",
                    marginRight: "2px"
                }}></i>Waiting for sender</button>}
            </div>}
            {pending === true && <div className='loadingContainer'>
                <Spinner
                    speed='0.9s'
                    width="130px"
                    height="130px"
                    thickness='13px'
                    color='rgb(3,151,91)'
                    marginBottom="10px"
                />
                <p>Transaction loading....</p>
                <p>Please wait</p>
            </div>}
        </Box>
    );
};