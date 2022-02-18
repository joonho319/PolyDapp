import { Button } from '@chakra-ui/button';
import { Box, Flex, Grid, Text } from '@chakra-ui/layout';
import React, { FC, useEffect, useState } from 'react';
import { MyOwnCard, IMyCard } from '../components/MyOwnCard';
import { mintCardTokenContract, saleCardTokenAddress, saleCardTokencontract } from '../contracts';

interface MyCardProps {
  account: string;
}
export const MyCard: FC<MyCardProps> = ({account}) => {
  const [myCardArray, setMyCardArray] = useState<IMyCard[]>();
  const [saleStatus, setSaleStatus] = useState<boolean>(false);

  const getCardTokens = async () => {
    try {
      const balanceLength = await mintCardTokenContract.methods.balanceOf(account).call();

      if(balanceLength === "0") return;

      const tempCardArray: IMyCard[] = [] ;

      const response = await mintCardTokenContract.methods.getCardTokens(account).call();

      response.map((v: IMyCard)=> {
        tempCardArray.push({cardTokenId: v.cardTokenId, cardType: v.cardType, cardPrice: v.cardPrice});
      });

      setMyCardArray(tempCardArray);
    } catch(e) {
      console.error(e);
    }
  }

  const getIsApprovedForAll = async() => {
    try {
      const response= await mintCardTokenContract.methods.isApprovedForAll(account, saleCardTokenAddress).call();
      
      if(response){
        setSaleStatus(response);
      }
    } catch(e) {

    }
  };

  const onClickApproveToggle = async () =>{
    try {
      if(!account) return ;

      const response= mintCardTokenContract.methods.setApprovalForAll(saleCardTokenAddress, !saleStatus).send({from: account});

      if(response.status) {
        setSaleStatus(!saleStatus);
      }
    } catch(e) {
      console.error(e);
    }
  }

  useEffect(()=> {
    if(!account) return ;
    getIsApprovedForAll();
    getCardTokens();
  },[account]);

  useEffect(()=> {
    console.log(myCardArray);
  },[myCardArray]);

  return (
    <>
      <Flex alignItems="center">
        <Text>Sale status  {saleStatus ? "true" : "red"}</Text>
        <Button size="xs" ml="2" colorScheme={saleStatus ? "red" : "blue"} onClick={onClickApproveToggle}>
          {saleStatus ? "Cancel" : "Approve"}
        </Button>
      </Flex>
      <Grid templateColumns="repeat(4,1fr)" gap="8" mt="4">
        {
          myCardArray && myCardArray.map((v,i)=> (
            <MyOwnCard key={i} cardType={v.cardType} cardPrice={v.cardPrice} cardTokenId={v.cardTokenId} account={account} saleStatus={saleStatus} />
          ))
        }
      </Grid>
    </>
  )
}