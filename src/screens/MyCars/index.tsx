import { useNavigation, useIsFocused } from '@react-navigation/native';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Alert, FlatList, StatusBar } from 'react-native';
import { useTheme } from 'styled-components';
import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';
import { Car as ModelCar } from '../../database/models/Car';
import { api } from '../../services/api';

import {
  Container,
  Header,
  Title,
  SubTitle,
  Content,
  Appointments,
  AppointmentsTitle,
  AppointmentsQuantity,
  CarWrapper,
  CarFooter,
  CarFooterTitle,
  CarFooterPeriod,
  CarFooterDate,
} from './style';
import { Load } from '../../components/Load';
import { format } from 'date-fns';

interface DataProps {
  id: string;
  car: ModelCar;
  start_date: string;
  end_date: string;
}

export function MyCars(){

  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [cars, setCars] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);

  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {

    let isMounted = true;

    async function fetchCars() {
      try {
        const response = await api.get('rentals');

        const dataFormatted = response.data.map((data: DataProps) => {
          return {
            id: data.car.id,
            car: data.car,
            start_date: format(new Date(data.start_date), 'dd/MM/yyyy'),
            end_date: format(new Date(data.start_date), 'dd/MM/yyyy')
          };
        })
        
        if(isMounted) {
          setCars(dataFormatted);
        }
      } catch (error) {
        Alert.alert('Agendamentos', 'Ocorreu uma falha ao buscar seus agendamentos')
      } finally {
        if(isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCars();

    return () => {
      isMounted = false;
    }
  }, [isFocused]);

  return (
    <Container>
      <Header>
        <StatusBar
          barStyle="light-content" 
          translucent 
          backgroundColor="transparent"
        />
        <BackButton
          color={colors.shape}
          onPress={handleBack}
        />
        <Title>Seus agendamentos, {'\n'}estão aqui.</Title>
        <SubTitle>Conforto, segurança e praticidade.</SubTitle>
      </Header>
      {loading ? <Load /> :
        <Content>
          <Appointments>
            <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
            <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
          </Appointments>
          <FlatList 
            data={cars}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <CarWrapper>
                <Car data={item.car}  />
                <CarFooter>
                  <CarFooterTitle>Período</CarFooterTitle>
                  <CarFooterPeriod>
                    <CarFooterDate>{item.start_date}</CarFooterDate>
                    <AntDesign 
                      name="arrowright"
                      size={20}
                      color={colors.title}
                      style={{
                        marginHorizontal: 10
                      }}
                    />
                    <CarFooterDate>{item.end_date}</CarFooterDate>
                  </CarFooterPeriod>
                </CarFooter>
              </CarWrapper>
            )}
          />
        </Content>
      }
    </Container>
  );
}