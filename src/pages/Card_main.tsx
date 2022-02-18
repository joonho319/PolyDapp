import {FC, useState} from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { mintCardTokenContract } from '../contracts';
import {Card} from '../components/Card';

interface MainProps {
  account: string;
}
export const Card_main: FC<MainProps> = ({account}) => {
  const [newType, setNewType] = useState<string>("");
  const onClickMint = async() => {
    try {
      if(!account) return;
      console.log(account)
      const response = await mintCardTokenContract.methods.mintCardToken().send({ from: account });

      if(response.status) {
        const balanceLength = await mintCardTokenContract.methods.balanceOf(account).call();

        const cardTokenId = await mintCardTokenContract.methods.tokenOfOwnerByIndex(account, parseInt(balanceLength.length ,10)-1).call();

        const cardType = await mintCardTokenContract.methods.cardTypes(cardTokenId).call();

        setNewType(cardType);
      }

    } catch(e) {
      console.error(e);
    }
  }
  return (
    <Flex w="full" h="100vh" justifyContent="center" alignItems="center" direction="column">
      <Box>
        {newType ? <Card cardType={newType} /> : <>let's mint card</>}
      </Box>
      <Button mt={4} size="sm" colorScheme="blue" onClick={onClickMint}>Mint</Button>
    </Flex>
  )
}