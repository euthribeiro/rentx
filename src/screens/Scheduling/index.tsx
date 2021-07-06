import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { format } from 'date-fns';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BackButton } from '../../components/BackButton'

import ArrowSvg from '../../assets/arrow.svg';

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValue,
  Content,
  Footer,
} from './style';
import { Button } from '../../components/Button';
import { Calendar, DayProps, generateInterval, MarkedDatesProps } from '../../components/Calendar';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { Alert } from 'react-native';

import { CarDTO } from '../../dtos/CarDTO';

interface RentalPeriod {
  startFormatted: string;
  endFormatted: string;
}

interface Params {
  car: CarDTO;
}

export function Scheduling(){

  const route = useRoute();

  const { car } = route.params as Params;

  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
  const [markedDates, setMarkedDates] = useState<MarkedDatesProps>({} as MarkedDatesProps);
  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);

  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleConfirmRental() {

    if(!rentalPeriod.startFormatted || !rentalPeriod.endFormatted) {
      Alert.alert('Intervalo', 'Selecione o intervalo para alugar');
      return;
    }

    navigation.navigate('SchedulingDetails', {
      car,
      dates: Object.keys(markedDates)
    });
  }

  function handleChangeDate(date: DayProps) {

    let start = !lastSelectedDate?.timestamp ? date : lastSelectedDate;
    let end = date;

    if(start.timestamp > end.timestamp) {
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);

    setMarkedDates(interval);

    const firstDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

    setRentalPeriod({
      startFormatted: format(getPlatformDate(new Date(firstDate)), 'dd/MM/yyyy'),
      endFormatted: format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy'),
    });
  }

  function handleBack() {
    navigation.goBack();
  }

  return (
    <Container>
      <StatusBar 
        barStyle="light-content" 
        translucent 
        backgroundColor="transparent"
      />
      <Header>
        <BackButton 
          color={colors.shape}
          onPress={handleBack}
        />
        <Title>Escolha uma{'\n'}data de início e{'\n'}fim do aluguel</Title>
        
        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue selected={!!rentalPeriod.startFormatted}>{rentalPeriod.startFormatted}</DateValue>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue selected={!!rentalPeriod.endFormatted}>{rentalPeriod.endFormatted}</DateValue>
          </DateInfo>

        </RentalPeriod>
      </Header>
      <Content>
        <Calendar 
          onDayPress={handleChangeDate}
          markedDates={markedDates}
        />
      </Content>
      <Footer>
        <Button 
          enabled={!(!rentalPeriod.startFormatted || !rentalPeriod.endFormatted)}
          title="Confirmar"
          onPress={handleConfirmRental}
        />
      </Footer>
    </Container>
  );
}