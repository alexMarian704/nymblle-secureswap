import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text } from '@chakra-ui/react';
import { FC, useState } from 'react';

interface CreateModalProps {
    onClose?: () => void;
    isOpen: boolean;
    nftsArray: NftsArray[]
    loading: boolean
}

interface NftsArray {
    identifier: string
    url: string
    fileType: string
}

export const CreateModal: FC<CreateModalProps> = ({ isOpen, onClose, nftsArray, loading }) => {
    const [address, setAddress] = useState('');
    const [nft, setNft] = useState<NftsArray | null>(null)

    const getNFTUrl = async () => {
        const response = await fetch("https://devnet-api.multiversx.com/nfts/FACES-dd0aec-0164")
        const data = await response.json();
        console.log(data.url);
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose!}

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
                        display:"grid",
                        placeContent:"center"
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
                    <button className="deployModalButton"><i className="bi bi-lightning-charge-fill" style={{
                        color: "#00e673",
                        fontSize: "calc(16px + 0.1vw)",
                        marginRight: "2px"
                    }}></i>Create</button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};