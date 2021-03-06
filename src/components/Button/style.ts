import { RectButton } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';

interface ButtonProps {
  color?: string;
}

interface ButtonTextProps {
  light: boolean;
}

export const Container = styled(RectButton)<ButtonProps>`
  width: 100%;
  padding: 19px;

  justify-content: center;
  align-items: center;

  ${({ enabled }) => !enabled && css`
    opacity: 0.5;
  `};

  background-color: ${({ theme, color }) => color ? color : theme.colors.main};
  margin-bottom: 8px;
`;

export const Title = styled.Text<ButtonTextProps>`
  font-family: ${({ theme }) => theme.fonts.primary_500};
  font-size: ${RFValue(15)}px;

  color: ${({ theme, light }) => light ? theme.colors.header : theme.colors.shape};
`;