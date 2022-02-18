import React, {FC} from 'react';
import { Image } from '@chakra-ui/react';

interface CardProps {
  cardType: string;
}
export const Card:FC<CardProps> = ({cardType}) => {
  return (
    <Image w="150" h="150" src={`images/${cardType}.png`} alt="card"></Image>
  )
}