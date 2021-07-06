import React from 'react';
import { ActivityIndicator } from 'react-native';
import { RectButtonProps } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components';

import {
  Container,
  Title
} from './style';

interface ButtonProps extends RectButtonProps {
  title: string;
  color?: string;
  enabled?: boolean;
  loading?: boolean;
}

export function Button({
  title,
  color,
  enabled = true,
  loading = false,
  ...rest
} : ButtonProps){

  const { colors } = useTheme();

  return (
    <Container enabled={!enabled || !loading} {...rest} color={color}>
      {loading ? 
        <ActivityIndicator color={colors.shape} size="small" />  :
        <Title>{title}</Title>
      }
    </Container>
  );
}