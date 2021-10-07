import { RFValue } from 'react-native-responsive-fontsize';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { CarDTO } from '../../dtos/CarDTO';
import { RectButton } from 'react-native-gesture-handler';
import { Car as ModelCar } from '../../database/models/Car';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_primary};
`;

export const Header = styled.View`
  width: 100%;
  height: ${RFValue(113)}px;

  background-color: ${({ theme }) => theme.colors.header};
  align-items: flex-end;
  flex-direction: row;
  justify-content: space-between;
  padding: 32px 24px;
`;

export const TotalCars = styled.Text`
  font-size: ${RFValue(15)}px;
  line-height: ${RFValue(18.15)}px;
  font-family: ${({ theme }) => theme.fonts.primary_400};

  color: ${({ theme }) => theme.colors.text};
`;

export const CarList = styled(
  FlatList as new () => FlatList<ModelCar>
).attrs({
  contentContainerStyle: {
    padding: 20
  }
})`

`;

export const MyCarsButton = styled(RectButton)`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.colors.main};

  justify-content: center;
  align-items: center;

  position: absolute;
  bottom: 13px;
  right: 22px;
`;