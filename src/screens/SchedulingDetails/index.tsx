import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Alert, StatusBar } from 'react-native';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';

import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Button } from '../../components/Button';

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  Footer,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuote,
  RentalPriceTotal,
} from './style';
import { CarDTO } from '../../dtos/CarDTO';
import { Car as ModelCar } from '../../database/models/Car';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { api } from '../../services/api';


interface Params {
  car: ModelCar;
  dates: string[];
}

interface RentalPeriod {
  start: string;
  end: string;
  
}

export function SchedulingDetails(){
  const [loading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
  
  const netInfo = useNetInfo();
  const { colors } = useTheme();
  const routes = useRoute();
  const { car, dates } = routes.params as Params;
  const rentTotal = Number(dates.length * car.price);
  const navigation = useNavigation();

  async function handleConfirm() {

    try {

      setLoading(true);

      await api.post(`/rentals`, {
        user_id: 1,
        car_id: car.id,
        start_date: new Date(dates[0]),
        end_date: new Date(dates[dates.length - 1]),
        total: rentTotal
      }).then(() => {
        navigation.navigate('Confirmation', {
          title: 'Carro alugado',
          message: 'Agora voc?? s?? precisa ir\nat?? a concession??ria da RENTX\npegar o seu autom??vel.',
          nextScreenRoute: 'Home'
        });
      }).catch(() => {
        Alert.alert('Agendamento', 'N??o foi poss??vel realizar o agendamento');
      });
    } catch(error) {
      Alert.alert('Agendamento', 'N??o foi poss??vel realizar o agendamento');
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {
    setRentalPeriod({
      start: format(new Date(dates[0]), 'dd/MM/yyyy'),
      end: format(new Date(dates[dates.length - 1]), 'dd/MM/yyyy'),
    })
  }, [dates]);

  useEffect(() => {

    let isMounted = true;

    async function fetchCarUpdated() {
      const response = await api.get(`cars/${car.id}`);

      if(isMounted) {
        setCarUpdated(response.data);
      }
    }

    if(netInfo.isConnected === true) {
      fetchCarUpdated();
    }

    return () => {
      isMounted = false;
    }
  }, [netInfo.isConnected]);

  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header>
        <BackButton onPress={handleBack} />
      </Header>
      <CarImages>
        <ImageSlider 
          imagesUrl={
            !!carUpdated.photos ?
            carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail }]
          }
        />
      </CarImages>
      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ {car.price}</Price>
          </Rent>
        </Details>
        <Accessories>
          {carUpdated.accessories && 
            <Accessories>
            {carUpdated.accessories.map(accessory => (
              <Accessory 
                key={accessory.type}
                name={accessory.name}
                icon={getAccessoryIcon(accessory.type)}
                  />
                ))}
            </Accessories>
          }
        </Accessories>
        <RentalPeriod>
          <CalendarIcon>
            <Feather 
              name="calendar"
              size={RFValue(24)}
              color={colors.shape}
            />
          </CalendarIcon>

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>

          <Feather 
            name="chevron-right"
            size={RFValue(10)}
            color={colors.text}
          />

          <DateInfo>
            <DateTitle>AT??</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>
        <RentalPrice>
          <RentalPriceLabel>Total</RentalPriceLabel>
          <RentalPriceDetails>
            <RentalPriceQuote>R$ {car.price} x{dates.length} di??rias</RentalPriceQuote>
            <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>
      <Footer>
        <Button 
          title="Alugar agora" 
          color={colors.success}
          onPress={handleConfirm}
          loading={loading}
        />
      </Footer>
    </Container>
  );
}