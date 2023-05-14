import type { NextPage } from 'next';
import {
  Box,
  Flex,
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
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const { address: userAddress } = useAccount();
  const [isUser, setIsUser] = useState(0);

  const getContractData = async () => {
    const apiProvider = new ApiNetworkProvider("https://devnet-api.multiversx.com")

    const contractAddress = new Address("erd1qqqqqqqqqqqqqpgqcvp6jd8c8skujd24x974xam203lzwstpn60qu5hx9q")
    let contract = new SmartContract({ address: contractAddress })

    const address = Address.fromBech32(userAddress);

    let query = contract.createQuery({
      func: new ContractFunction("getIsUser"),
      args: [new AddressValue(address)],
      caller: new Address(userAddress)
    });

    let resultsParser = new ResultsParser()

    let queryResponse = await apiProvider.queryContract(query)
    let bundle = resultsParser.parseUntypedQueryResponse(queryResponse);

    if(bundle.values[0].toString('hex') === "01"){
      setIsUser(1);
    }else{
      setIsUser(2);
    }
  }

  useEffect(()=>{
    if(userAddress){
      getContractData();
    }
  },[userAddress])

  function hexToString(hex: String) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      const hexChar = hex.substr(i, 2);
      const charCode = parseInt(hexChar, 16);
      str += String.fromCharCode(charCode);
    }
    return str;
  }

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
        {isUser === 2 && <NewSwap />}
        {isUser === 1 && <Swap />}
      </Authenticated>
    </MainLayout>
  );
};

export default Home;
