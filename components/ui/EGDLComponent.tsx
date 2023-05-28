import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Address, AddressValue, ContractFunction, ResultsParser, SmartContract } from '@multiversx/sdk-core/out';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';

interface EGLDComponentProps {
    userAddress: string;
    receiver: string;
    provided: boolean;
    egldValue: string;
    setEgldValue: Dispatch<SetStateAction<string>>
    setProvided: Dispatch<SetStateAction<boolean>>
    receiverHasVote: boolean
    contractMainAddress:string
}

export const EGLDComponent: FC<EGLDComponentProps> = ({ userAddress, receiver, provided, setProvided, egldValue, setEgldValue, receiverHasVote, contractMainAddress }) => {

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

        const contractAddress = new Address(contractMainAddress)
        const contract = new SmartContract({ address: contractAddress })

        const query = contract.createQuery({
            func: new ContractFunction("getAmount"),
            args: [new AddressValue(Address.fromBech32(receiver))],
            caller: new Address(userAddress)
        });

        const resultsParser = new ResultsParser()

        const queryResponse = await apiProvider.queryContract(query)
        const bundle = resultsParser.parseUntypedQueryResponse(queryResponse);

        const parsedValue = parseInt(bundle.values[0].toString('hex'), 16)/10**18;
        if (isNaN(parsedValue)) {
            setProvided(false);
        } else {
            setEgldValue(String(parsedValue))
        }
    }

    return (
        <div className='egldInputComponent'>
            <div>
                <img src="/egldimage.jpg" alt="MultiversX Logo" />
                <h3>EGLD</h3>
            </div>
            {receiverHasVote === false && receiver === userAddress && provided === false && <input type="text" placeholder='0.0' value={egldValue} onChange={(e) => {
                setEgldValue(e.target.value);
            }} />}
            {((receiver === userAddress && receiverHasVote === true && provided === false) || (receiver !== userAddress && provided === false)) && <h3 style={{
                textAlign: "center",
                color: "rgb(210,210,210)"
            }}>Not provided</h3>}
            {provided === true && <h3 style={{
                textAlign: "center",
                color: "rgb(220,220,220)",
                display: "grid",
                placeContent: "center",
                padding: "10px",
                fontSize: "calc(26px + 0.1vw)"
            }}>{egldValue}</h3>}
        </div>
    );
};