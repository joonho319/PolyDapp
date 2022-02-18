import { Grid } from '@chakra-ui/layout';
import React , {FC, useEffect, useState} from 'react';
import { IMyCard } from '../components/MyOwnCard';
import  { OnSaleCard }  from '../components/OnSaleCard';
import { mintCardTokenContract, saleCardTokencontract } from '../contracts';

interface SaleCardProps {
  account: string;
}
export const SaleCard: FC<SaleCardProps> = ({account}) => {
  const [saleCardArray , setCardArray]= useState<IMyCard[]>();

  const getOnsaleCardTokens = async() => {
    const onsaleCardTokenArrayLength = await saleCardTokencontract.methods.getOnSaleCardTokenArrayLength().call();

    const tempOnSaleArray: IMyCard[] = [];
    for(let i =0 ;i< parseInt(onsaleCardTokenArrayLength, 10) ;i ++) {
      const cardTokenId = await saleCardTokencontract.methods.onSaleTokenArray(i).call();

      const cardType = await mintCardTokenContract.methods.cardTypes(cardTokenId).call();

      const cardPrice = await saleCardTokencontract.methods.cardTokenPrices().call();

      tempOnSaleArray.push({cardTokenId, cardType, cardPrice});

    }
    setCardArray(tempOnSaleArray);
  }

  useEffect(()=> {
    getOnsaleCardTokens();
  },[]);

  return (
    <Grid mt="4" templateColumns="repeat(4,1fr) " gap="8">
      {saleCardArray && saleCardArray.map((v,i) => (
        <OnSaleCard 
          cardType={v.cardType} 
          cardPrice={v.cardPrice} 
          cardTokenId={v.cardTokenId} 
          account={account} 
          getOnsaleCardTokens={getOnsaleCardTokens} 
        />
      ))}
    </Grid>
  )
}