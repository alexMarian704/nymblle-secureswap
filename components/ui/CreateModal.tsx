import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import { FC, useState } from 'react';

interface CreateModalProps {
    onClose?: () => void;
    isOpen: boolean
}

export const CreateModal: FC<CreateModalProps> = ({ isOpen, onClose }) => {
    const [address, setAddress] = useState('');
    const [nft, setNft] = useState('')

    const getNFTUrl = async ()=>{
        const response = await fetch("https://devnet-api.multiversx.com/nfts/FACES-dd0aec-0164")
        const data = await response.json();
        console.log(data.url);
    }

    const getNFTs= async ()=>{
        const response = await fetch("https://devnet-api.multiversx.com/accounts/erd1lpg4rqgeshusq0n73zzflwkzs0f6mxr6kt3ttx2v7mqktcxyn60qghnw70/nfts")
        const data = await response.json();

        for(let dataIndex = 0; dataIndex < data.length; dataIndex++){
            const dataObject = data[dataIndex];
            if(dataObject.type === "NonFungibleESDT"){
                if(validURL(dataObject.url))
                    console.log(dataObject)
            }
        }
    }

    function validURL(str:string) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ 
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
          '((\\d{1,3}\\.){3}\\d{1,3}))'+
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
          '(\\#[-a-z\\d_]*)?$','i');
        return !!pattern.test(str);
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
                    <div className="contractInputs">
                        <label>NFT identifier</label>
                        <input type="text" value={nft} onChange={(e) => {
                            setNft(e.target.value)
                        }} />
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button onClick={getNFTs} className="deployModalButton"><i className="bi bi-lightning-charge-fill" style={{
                        color: "#00e673",
                        fontSize: "calc(16px + 0.1vw)",
                        marginRight: "2px"
                    }}></i>Create</button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};