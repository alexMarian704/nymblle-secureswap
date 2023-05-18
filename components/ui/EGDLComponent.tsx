import { Box } from '@chakra-ui/react';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Address, AddressValue, ContractFunction, ResultsParser, SmartContract } from '@multiversx/sdk-core/out';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';

interface EGLDComponentProps {
    userAddress: string;
    receiver: string;
    provided:boolean;
    setProvided:Dispatch<SetStateAction<boolean>>
}

export const EGLDComponent: FC<EGLDComponentProps> = ({ userAddress, receiver, provided, setProvided }) => {
    const [egldValue, setEgldValue] = useState("");

    useEffect(() => {
        if (egldValue[0] !== ".") {
            setEgldValue(egldValue.replace(/[^\d.]/g, ''))
            if (egldValue[egldValue.length - 1] === "." && egldValue.slice(0, -1).includes(".") === true) {
                setEgldValue(egldValue.slice(0, -1))
            }
        } else {
            setEgldValue(egldValue.substring(1))
        }
    }, [egldValue])

    useEffect(() => {
        getAmount();
    }, [])

    const getAmount = async () => {
        const apiProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com")

        const contractAddress = new Address("erd1qqqqqqqqqqqqqpgqcvp6jd8c8skujd24x974xam203lzwstpn60qu5hx9q")
        let contract = new SmartContract({ address: contractAddress })

        let query = contract.createQuery({
            func: new ContractFunction("getAmount"),
            args: [new AddressValue(Address.fromBech32(receiver))],
            caller: new Address(userAddress)
        });

        let resultsParser = new ResultsParser()

        let queryResponse = await apiProvider.queryContract(query)
        let bundle = resultsParser.parseUntypedQueryResponse(queryResponse);

        const parsedValue = parseInt(bundle.values[0].toString('hex'), 16);
        if (isNaN(parsedValue)) {
            setProvided(false);
        }else{
            setEgldValue(String(parseInt))
        }
    }

    return (
        <div className='egldInputComponent'>
            <div>
                <img src="/egldimage.jpg" alt="MultiversX Logo" />
                <h3>EGLD</h3>
            </div>
            {receiver === userAddress && provided === false && <input type="text" placeholder='0.0' value={egldValue} onChange={(e) => {
                setEgldValue(e.target.value);
            }} />}
            {receiver !== userAddress && provided === false && <h3 style={{
                textAlign: "center",
                color: "rgb(210,210,210)"
            }}>Not provided</h3>}
             {provided === true && <h3 style={{
                textAlign: "center",
                color: "rgb(220,220,220)",
                display:"grid",
                placeContent:"center",
                padding:"10px",
                fontSize:"calc(26px + 0.1vw)"
            }}>{egldValue}</h3>}
        </div>
    );
};