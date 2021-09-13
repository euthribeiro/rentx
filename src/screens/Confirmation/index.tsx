import React from 'react';
import { StatusBar, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';

import LogoSvg from '../../assets/logo_background_gray.svg';
import DoneSvg from '../../assets/done.svg';

import {
  Container,
  Content,
  Title,
  Message,
  Footer,
} from './style';
import { ConfirmButton } from '../../components/ConfirmButton';

interface Params {
  title: string;
  message: string;
  nextScreenRoute: string;
}

export function Confirmation(){

  const route = useRoute();
  const { width } = useWindowDimensions();

  const navigation = useNavigation();

  const { message, nextScreenRoute, title } = route.params as Params;

  function handleConfirm() {
    navigation.navigate(nextScreenRoute);
  }

  return (
    <Container>
      <StatusBar 
        barStyle="light-content"
        translucent 
        backgroundColor="transparent"
      />
      <LogoSvg width={width} />
      <Content>
        <DoneSvg 
          width={RFValue(80)} 
          height={RFValue(80)}
        />
        <Title>{title}</Title>
        <Message>{message}</Message>  
      </Content>
      <Footer>
        <ConfirmButton 
          title="OK"
          onPress={handleConfirm}
        />
      </Footer>
    </Container>
  );
}