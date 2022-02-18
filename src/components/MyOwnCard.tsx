import { Button } from '@chakra-ui/button';
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/input';
import { Box, Text } from '@chakra-ui/layout';
import React, {ChangeEvent, FC, useState} from 'react';
import { saleCardTokencontract, web3 } from '../contracts';
import { Card } from './Card';

export interface IMyCard {
  cardTokenId: string;
  cardType: string;
  cardPrice: string;
}
interface MyCardProps extends IMyCard {
  saleStatus: boolean;
  account: string;
}

export const MyOwnCard:FC<MyCardProps> = ({cardType, cardPrice, cardTokenId, account, saleStatus }) => {
  const [sellPrice, setSellPrice] = useState<string>("");
  const [myCardPrice, setMyCardPrice] = useState<string>(cardPrice);

  const onChangeSellPrice = (e: ChangeEvent<HTMLInputElement>) => {
    setSellPrice(e.target.value);
  };

  const onClickSell= async () => {
    try {
      if( !account || !saleStatus) return ;

      const response = await saleCardTokencontract.methods.setForSaleCardToken(cardTokenId, web3.utils.toWei(sellPrice, 'ether')).send({from: account});

      if(response.status){
        setMyCardPrice(web3.utils.toWei(sellPrice, 'ether'));
      }
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <Box textAlign="center" w="150">
        <Card cardType={cardType} />
        <Box mt="2">
          {
            myCardPrice === "0" ?
             <div>
               <InputGroup>
                <Input type="number" value={sellPrice} onChange={onChangeSellPrice} />
                <InputRightAddon children="Matic" />
               </InputGroup>
               <Button size="sm" colorScheme="green" mt="2" onClick={onClickSell}>Sell</Button>
             </div> : 
            <Text d="inline-block" >
              {web3.utils.fromWei(myCardPrice)}Matic
            </Text>
          }
        </Box>
    </Box>
  )
}