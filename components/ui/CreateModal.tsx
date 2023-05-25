import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text } from '@chakra-ui/react';
import { Address, AddressValue, BigUIntValue, BytesValue, ContractCallPayloadBuilder, ContractFunction, TokenIdentifierValue, U64Value } from '@multiversx/sdk-core/out';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { useAccount, useTransaction } from '@useelven/core';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';

interface CreateModalProps {
    onClose: () => void;
    isOpen: boolean;
    nftsArray: NftsArray[]
    loading: boolean;
    setRefreshData: Dispatch<SetStateAction<boolean>>;
    refreshData: boolean;
    setLoadingMain: Dispatch<SetStateAction<boolean>>;
}

interface NftsArray {
    identifier: string
    url: string
    fileType: string
}

export const CreateModal: FC<CreateModalProps> = ({ isOpen, onClose, nftsArray, loading, setRefreshData, refreshData, setLoadingMain }) => {
    const [address, setAddress] = useState('');
    const [nft, setNft] = useState<NftsArray | null>(null)
    const [nftNonce, setNftNonce] = useState(0)
    const [nftCollection, setNftCollection] = useState('');
    const { address: userAddress } = useAccount()
    const { pending, triggerTx, transaction, txResult, error } = useTransaction();

    const getNFTUrl = async () => {
        const response = await fetch(`https://devnet-api.multiversx.com/nfts/${nft?.identifier}`)
        const data = await response.json();
        //console.log(data);
        setNftNonce(data.nonce)
        setNftCollection(data.collection);
    }

    const sendNft = useCallback(async () => {
        const apiProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com")

        const func = new ContractFunction("ESDTNFTTransfer")
        const contractAddress = 'erd1qqqqqqqqqqqqqpgq0wmlsr7zcpktfcgqk0wm4s2scyzjwmydn60qz8frzl'
        const addressContractBech32 = Address.fromBech32(contractAddress);

        const data = new ContractCallPayloadBuilder()
            .setFunction(func)
            .setArgs([BytesValue.fromUTF8(nftCollection), new U64Value(nftNonce), new BigUIntValue(1), new AddressValue(addressContractBech32), BytesValue.fromUTF8("initiate_swap"), new TokenIdentifierValue(nftCollection), new U64Value(nftNonce), new AddressValue(new Address(address))])
            .build();

        triggerTx({
            address: userAddress,
            gasLimit: 80000000,
            value: 0,
            data,
        });

        setNft(null)
        setAddress("")
    }, [triggerTx])

    useEffect(() => {
        if (transaction !== null) {
            setTimeout(()=>{
                setRefreshData(!refreshData)
            },500)
        }
    }, [transaction, pending])

    useEffect(()=>{
        setLoadingMain(pending)
    },[pending])

    useEffect(() => {
        if (nft !== null) {
            getNFTUrl();
        }
    }, [nft])

    return (
        <Modal
            isOpen={isOpen}
            onClose={()=>{
                onClose()!
                setNft(null)
            }}
        >
            <ModalOverlay />
            <ModalContent style={{
                background: "rgb(16,16,16)",
                paddingTop: "20px",
                marginTop: "300px"
            }}>
                <ModalHeader><Text textAlign="center" fontWeight="black" fontSize="2xl">
                    Create Swap
                </Text></ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div className="contractInputs">
                        <label>Address</label>
                        <input type="text" value={address} onChange={(e) => {
                            setAddress(e.target.value)
                        }} />
                    </div>
                    {nft !== null && <div className='selectNFT'>
                        {nft.fileType.startsWith("video") ? <div onClick={() => {
                            setNft(null)
                        }}><video controls src={nft.url}></video></div> : <img onClick={() => {
                            setNft(null)
                        }} src={nft.url} alt={nft.identifier} />}
                        <h2 style={{
                            marginTop: "5px",
                            textAlign: "center"
                        }}>{nft.identifier}</h2>
                    </div>}
                    {nft === null && nftsArray.length > 0 && <div className='nftsContainer'>
                        {nftsArray.map((nft) => {
                            if (nft.fileType.startsWith("video")) {
                                return (
                                    <div key={nft.identifier} className='videoContainer' onClick={() => {
                                        setNft(nft)
                                    }}>
                                        <video controls src={nft.url}></video>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={nft.identifier} className='videoContainer'>
                                        <img src={nft.url} alt={nft.identifier} onClick={() => {
                                            setNft(nft)
                                        }} />
                                    </div>
                                )
                            }
                        })}
                    </div>}
                    {loading === false && nftsArray.length === 0 && <div>
                        <h2 style={{
                            textAlign: "center"
                        }}>No NFTs found</h2>
                    </div>}
                    {loading === true && <div style={{
                        display: "grid",
                        placeContent: "center"
                    }}>
                        <Spinner
                            speed='0.9s'
                            width="90px"
                            height="90px"
                            thickness='10px'
                            color='rgb(3,151,91)'
                            marginBottom="8px"
                        />
                    </div>}
                </ModalBody>
                <ModalFooter>
                    <button onClick={()=> {sendNft(); onClose();}} disabled={(nft === null || address === "") ? true : false} className="deployModalButton" style={{
                        opacity: (nft === null || address === "") ? "0.4" : "1"
                    }}><i className="bi bi-lightning-charge-fill" style={{
                        color: "#00e673",
                        fontSize: "calc(16px + 0.1vw)",
                        marginRight: "2px",
                    }}></i>Create</button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};