import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import GasolineSvg from '../../assets/gasoline.svg';

import {
  Container,
  Details,
  Brand,
  Name, 
  About,
  Rent,
  Period,
  Price,
  Type,
  CarImg,
} from './styles';

interface CarData {
  brand: string;
  name: string;
  rent: {
    period: string;
    price: number;
  },
  thumbnail: string;
}

interface CarProps extends RectButtonProps {
  data: CarData;
}

export function Car({
  data,
  ...rest
} : CarProps){
  return (
    <Container {...rest}>
      <Details>
        <Brand>{data.brand}</Brand>
        <Name>RS 5 Coupé</Name>
        <About>
          <Rent>
            <Period>{data.rent.period}</Period>
            <Price>{data.rent.price}</Price>
          </Rent>

          <Type>
            <GasolineSvg />
          </Type>
        </About>
      </Details>

      <CarImg source={{ uri: data.thumbnail }} resizeMode="contain" />
    </Container>
  );
}