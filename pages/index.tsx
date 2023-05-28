import type { NextPage } from 'next';
import {
  Box,
  Flex,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { MainLayout } from '../components/ui/MainLayout';
import { HeaderMenu } from '../components/ui/HeaderMenu';
import { HeaderMenuButtons } from '../components/ui/HeaderMenuButtons';
import { Authenticated } from '../components/tools/Authenticated';
import { LoginModalButton } from '../components/tools/LoginModalButton';
import { NewSwap } from '../components/ui/NewSwap';
import { Swap } from '../components/ui/SwapComponent';
import { Address, AddressValue, ContractFunction, ResultsParser, SmartContract } from '@multiversx/sdk-core/out';
import { useAccount } from '@useelven/core';
import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { FC, useEffect, useState } from 'react';
import { shortenHash } from '../utils/shortenHash';

type SwapProps = {
  contractMainAddress:string
}

const Home = ({ contractMainAddress } : SwapProps) => {
  const { address: userAddress, balance } = useAccount();
  const [isUser, setIsUser] = useState(0);
  const [error, setError] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receiverInfo, setReceiverInfo] = useState("");

  const getContractData = async () => {
    const apiProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com")

    const contractAddress = new Address(contractMainAddress)
    const contract = new SmartContract({ address: contractAddress })

    const address = Address.fromBech32(userAddress);

    const query = contract.createQuery({
      func: new ContractFunction("getIsUser"),
      args: [new AddressValue(address)],
      caller: new Address(userAddress)
    });

    const resultsParser = new ResultsParser()

    const queryResponse = await apiProvider.queryContract(query)
    const bundle = resultsParser.parseUntypedQueryResponse(queryResponse);

    if (bundle.values[0].toString('hex') === "01") {
      setIsUser(1);
    } else {
      setIsUser(2);
      setReceiverInfo("")
    }
  }

  useEffect(() => {
    if (userAddress) {
      getContractData();
    }
  }, [userAddress, refreshData])

  return (
    <MainLayout>
      <HeaderMenu>
        <HeaderMenuButtons enabled={['auth']} />
      </HeaderMenu>
      <Authenticated
        spinnerCentered
        fallback={
          <>
            <Box
              height="300px"
              background="rgba(12,12,12,0.4)"
              borderRadius="7px"
              border="1px solid rgb(110,110,110)"
              width="calc(450px + 1vw)"
              margin="auto"
              marginTop="50px"
              paddingTop="51px"
              sx={{
                '@media screen and (max-width: 500px)': {
                  width: "95%",
                },
              }}
            >
              <Flex flexDirection="column" alignItems="center">
                <i className="bi bi-wallet2"
                  style={{
                    fontSize: "calc(50px + 0.2vw)",
                    color: "rgb(3, 131, 90)"
                  }}
                ></i>
                <Text
                  fontSize="calc(25px + 0.1vw)"
                  fontWeight="600"
                >Connect Your Wallet</Text>
              </Flex>
              <Flex mt={4} justifyContent="center">
                <LoginModalButton text={"Connect Wallet"} />
              </Flex>
            </Box>
          </>
        }
      >
        <div className='accountInfo'>
          <h2 style={{
            marginTop: "7px",
            fontSize: "calc(19px + 0.1vw)",
            borderLeft: "3px solid rgb(3, 151, 90)",
            paddingLeft: "6px"
          }}><span style={{
            fontWeight: "900",
            // textDecoration:"underline",
            // textDecorationColor:"rgb(3, 151, 90)",
            // textDecorationThickness:"2px"
          }}>Address:</span> {shortenHash(userAddress, 11)}</h2>
          {receiverInfo === "" && <h3 style={{
            marginTop: "7px",
            fontSize: "calc(19px + 0.1vw)",
            borderLeft: "3px solid rgb(3, 151, 90)",
            paddingLeft: "6px"
          }}><span style={{
            fontWeight: "900",
            // textDecoration:"underline",
            // textDecorationColor:"rgb(3, 151, 90)",
            // textDecorationThickness:"2px"
          }}>Balance:</span> {(parseInt(balance) / 10 ** 18).toPrecision(3)} EGLD</h3>}
          {receiverInfo !== "" && <h3 style={{
            marginTop: "7px",
            fontSize: "calc(19px + 0.1vw)",
            borderLeft: "3px solid rgb(3, 151, 90)",
            paddingLeft: "6px"
          }}><span style={{
            fontWeight: "900",
            // textDecoration:"underline",
            // textDecorationColor:"rgb(3, 151, 90)",
            // textDecorationThickness:"2px"
          }}>Recipient:</span> {shortenHash(receiverInfo, 11)}</h3>}
        </div>
        {isUser === 2 && <NewSwap setError={setError} setRefreshData={setRefreshData} refreshData={refreshData} setLoading={setLoading} contractMainAddress={contractMainAddress} />}
        {isUser === 1 && <Swap setError={setError} setRefreshData={setRefreshData} refreshData={refreshData} receiverInfo={receiverInfo} setReceiverInfo={setReceiverInfo} contractMainAddress={contractMainAddress} />}
        <p style={{
          width: "100%",
          textAlign: "center",
          marginTop: "20px",
          fontSize: "calc(20px + 0.1vw)",
          color: "#e80971"
        }}>{error}</p>
        {loading === true && <div className='loadingContainer' style={{
          paddingTop: "100px"
        }}>
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
      </Authenticated>
    </MainLayout>
  );
};

export default Home;
