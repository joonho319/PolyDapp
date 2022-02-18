import { Button } from '@chakra-ui/button';
import { Box, Text } from '@chakra-ui/layout';
import React, { FC, useEffect, useState } from 'react';
import { mintCardTokenContract, saleCardTokencontract, web3 } from '../contracts';
import { Card } from './Card';

interface SaleCardProps {
  cardType: string;
  cardPrice: string;
  cardTokenId: string;
  account: string;
  getOnsaleCardTokens: () => Promise<void>

}
export const OnSaleCard:FC<SaleCardProps> = ({cardType, cardPrice, cardTokenId, account, getOnsaleCardTokens}) => {
  const [isBuyable, setIsBuyable] = useState<boolean>(false) ;

  const getCardTokenOwner = async() => {
    try {
      const response = await mintCardTokenContract.methods.ownerOf(cardTokenId).call();
      
      setIsBuyable(account.toLowerCase() === response.toLowerCase());
    } catch (e) {
      console.log(e)
    }
  } 

  useEffect(()=> {
    getCardTokenOwner();
  },[])
  const onClickBuy = async() => {
    try {
      if(!account) return;
      const response = await saleCardTokencontract.methods.purchaseCardToken(cardTokenId).send({from: account, value: cardPrice});

      if(response.status) {
        getOnsaleCardTokens();
      }
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <Box textAlign="center" w="150">
      <Card cardType={cardType} />
      <Box>
        <Text d="inline-block">
          {web3.utils.fromWei(cardPrice)} Matic
        </Text>
        <Button size="sm" colorScheme="green" m="2" disabled={isBuyable} onClick={onClickBuy}>Buy</Button>
      </Box>
    </Box>
  )
} 