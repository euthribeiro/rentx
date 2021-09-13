import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
  KeyboardAvoidingView, 
  Keyboard, 
  TouchableWithoutFeedback, 
  Alert 
} from 'react-native';
import * as Yup from 'yup';

import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';

import {
  Container,
  Header,
  Steps,
  Title,
  SubTitle,
  Form,
  FormTitle,
} from './style';

export function SignUpFirstStep(){

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [driveLicense, setDriveLicense] = useState('');

  const navigation = useNavigation();

  function handleBack() {
    navigation.goBack();
  }

  async function handleNextStep() {

    try {
      const schema = Yup.object().shape({
        driveLicense: Yup.string()
        .required('CNH é obrigatória'),
        name: Yup.string()
          .required('Nome é obrigatório'),
        email: Yup.string()
          .email('E-mail inválido')
          .required('E-mail é obrigatório')
      });


      const data = { name, email, driveLicense }; 

      await schema.validate(data);

      navigation.navigate('SignUpSecondStep', {
        user: data
      });
    } catch(e) {
      if(e instanceof Yup.ValidationError) {
        return Alert.alert('Erro', e.message);
      }
    }
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
        <Header>
          <BackButton onPress={handleBack} />
          <Steps>
            <Bullet active />
            <Bullet />
          </Steps>
        </Header>

        <Title>Crie sua{'\n'}conta</Title>

        <SubTitle>Faça seu cadastro{'\n'}de forma rápida e fácil</SubTitle>

        <Form>
          <FormTitle>1. Dados</FormTitle>
          <Input 
            iconName="user"
            placeholder="Nome"
            onChangeText={setName}
            value={name}
          />
          <Input 
            iconName="mail"
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
          />
          <Input 
            iconName="credit-card"
            placeholder="CNH"
            value={driveLicense}
            onChangeText={setDriveLicense}
          />
        </Form>
        <Button 
          title="Próximo"
          onPress={handleNextStep}
        />
      </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}