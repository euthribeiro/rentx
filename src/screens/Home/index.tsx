import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';

import { api } from '../../services/api';

import Logo from '../../assets/logo.svg';
import { Car } from '../../components/Car';
import { Load } from '../../components/Load';

import {
  Container,
  Header,
  TotalCars,
  CarList,
  MyCarsButton,
} from './styles';

import { CarDTO } from '../../dtos/CarDTO';
import { useTheme } from 'styled-components';


export function Home(){
  
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<CarDTO[]>([]);

  function handleCarDetails(car: CarDTO) {
    navigation.navigate('CarDetails', {
      car
    });
  }

  function handleMyCars() {
    navigation.navigate('MyCars');
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get('cars');

        setCars(response.data);
      } catch(error) {

      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  return (
    <Container>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <Header>
        <Logo width={RFValue(108)} height={RFValue(12)} />
        <TotalCars>Total de {cars.length} carros</TotalCars>
      </Header>
      {loading ? <Load /> : 
        <CarList 
          showsVerticalScrollIndicator={false}
          data={cars}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => <Car data={item} onPress={() => handleCarDetails(item)} />}
        />
      }
      <MyCarsButton onPress={handleMyCars}>
        <Ionicons 
          name="ios-car-sport" 
          size={32}
          color={colors.shape}
        />
      </MyCarsButton>
    </Container> 
  );
}