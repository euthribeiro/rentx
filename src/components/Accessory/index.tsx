import React from 'react';
import { SvgProps } from 'react-native-svg';
import { useTheme } from 'styled-components';

import {
  Container,
  Name,
} from './style';

interface AcessoryProps {
  name: string;
  icon: React.FC<SvgProps>;
}

export function Accessory({
  name,
  icon: Icon
} : AcessoryProps){

  const { colors } = useTheme();

  return (
    <Container>
      <Icon 
        width={32} 
        height={32}
        fill={colors.header}
      />
      <Name>{name}</Name>
    </Container>
  ); 
}