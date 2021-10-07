import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNetInfo } from '@react-native-community/netinfo';
import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from '../../database';
import { Car as ModelCar } from '../../database/models/Car';

import { api } from '../../services/api';

import Logo from '../../assets/logo.svg';
import { Car } from '../../components/Car';
import { Load } from '../../components/Load';

import {
  Container,
  Header,
  TotalCars,
  CarList,
} from './styles';

export function Home(){
  
  const navigation = useNavigation();
  const netInfo = useNetInfo();

  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<ModelCar[]>([]);

  function handleCarDetails(car: ModelCar) {
    navigation.navigate('CarDetails', {
      car
    });
  }

  async function offlineSyncronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {

        const response = await api
          .get(`cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`);

        const { changes, latestVersion } = response.data;
        
        return { changes: changes, timestamp: latestVersion };
      },
      pushChanges: async ({ changes }) => {
        try {
          const user = changes.users;

          await api.post('users/sync', user);

        } catch {}
      }
    });
  }

  useEffect(() => {

    let isMounted = true;

    async function fetchCars() {
      try {
       const carCollecttion = database.get<ModelCar>('cars');

       const cars = await carCollecttion.query().fetch();

       if(isMounted) {
         setCars(cars);
       }
      } catch(error) {

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
  }, []);

  useEffect(() => {
    if(netInfo.isConnected === true) {
      offlineSyncronize();
    }

  }, [netInfo.isConnected]);

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
    </Container> 
  );
}