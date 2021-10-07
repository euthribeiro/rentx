import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { StyleSheet } from 'react-native';
import { useTheme } from 'styled-components';
import { useNetInfo } from '@react-native-community/netinfo';

import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Button } from '../../components/Button';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { Car as ModelCar } from '../../database/models/Car';
import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';

import {
  Container,
  Header,
  CarImages,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  About,
  Accessories,
  Footer,
  OfflineInfo,
} from './style';

interface Params {
  car: ModelCar;
}

export function CarDetails(){

  const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);
  
  const route = useRoute();
  const { car } = route.params as Params;
  const navigation = useNavigation();
  const { colors } = useTheme();
  const netInfo = useNetInfo();

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(scrollY.value,
        [0, 200],
        [200, 90],
        Extrapolate.CLAMP
      )
    }
  });

  const sliderCarStyleAnimation = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 150], [1, 0], Extrapolate.CLAMP)
    }
  })

  function handleConfirmRental() {
    navigation.navigate('Scheduling', {
      car
    });
  }

  function handleBack() {
    navigation.goBack();
  }

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
      <Animated.View style={[headerStyle, styles.header, { backgroundColor: colors.background_secondary }]}>
        <Header>
          <BackButton 
            onPress={handleBack}
          />
        </Header>
        <Animated.View style={[sliderCarStyleAnimation]}>
          <CarImages>
            <ImageSlider 
              imagesUrl={
                !!carUpdated.photos ?
                carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail }]
              }
            />
          </CarImages>
        </Animated.View>
      </Animated.View>
      <Animated.ScrollView
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: getStatusBarHeight() + 160
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>
          <Rent>
            <Period>{car.period}</Period>
            <Price>R$ {netInfo.isConnected ? car.price : '...'}</Price>
          </Rent>
        </Details>
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
        <About>{car.about}</About>
      </Animated.ScrollView>
      <Footer>
        <Button 
          title="Escolher período do aluguel"
          onPress={handleConfirmRental}
          enabled={netInfo.isConnected === true}
        />
        {netInfo.isConnected === false && 
          <OfflineInfo>
            Conecte-se a internet para ver mais detalhes
            e agendar seu carro
          </OfflineInfo> 
        }
      </Footer>
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    overflow: 'hidden',
    zIndex: 1,
  },
})