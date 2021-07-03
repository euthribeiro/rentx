import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { BorderlessButtonProps } from 'react-native-gesture-handler';

import {
  Container
} from './style';

interface BackButtonProps extends BorderlessButtonProps {
  color?: string;
}

export function BackButton({
  color
} : BackButtonProps){

  const { colors } = useTheme();

  return (
    <Container>
      <MaterialIcons 
        name="chevron-left" 
        color={color ? color : colors.text}
        size={24}
      />
    </Container>
  );
}