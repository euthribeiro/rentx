import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { 
  KeyboardAvoidingView, 
  Keyboard, 
  TouchableWithoutFeedback, 
  Alert
} from 'react-native';
import { BackButton } from '../../../components/BackButton';
import { Bullet } from '../../../components/Bullet';
import { Button } from '../../../components/Button';
import { PasswordInput } from '../../../components/PasswordInput';

import {
  Container,
  Header,
  Steps,
  Title,
  SubTitle,
  Form,
  FormTitle,
} from './style';
import { api } from '../../../services/api';

interface Params {
  user: {
    name: string; 
    email: string;
    driveLicense: string;
  }
}

export function SignUpSecondStep(){

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { user } = route.params as Params;

  function handleBack() {
    navigation.goBack();
  }

  async function handleRegister() {
    if(!password || !passwordConfirm) {
      return Alert.alert('Senha', 'Informe a senha e a confirmação dela');
    }

    if(password !== passwordConfirm) {
      return Alert.alert('Senhas', 'Senhas não são iguais');
    }

    await api.post('/users', {
      name: user.name,
      email: user.email,
      password,
      driver_license: user.driveLicense
    }).then(() => {
      navigation.navigate('Confirmation', {
        title: 'Conta criada!',
        message: 'Agora é só fazer o login\ne aproveitar',
        nextScreenRoute: 'SignIn'
      });
    }).catch((error) => {
      Alert.alert('Opa', 'Não foi possível cadastrar')
    });
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
        <Header>
          <BackButton onPress={handleBack} />
          <Steps>
            <Bullet />
            <Bullet active />
          </Steps>
        </Header>

        <Title>Crie sua{'\n'}conta</Title>

        <SubTitle>Faça seu cadastro{'\n'}de forma rápida e fácil</SubTitle>

        <Form>
          <FormTitle>2. Senha</FormTitle>
          <PasswordInput 
            iconName="lock"
            placeholder="Senha"
            onChangeText={setPassword}
            value={password}
          />
          <PasswordInput 
            iconName="lock"
            placeholder="Repetir senha"
            onChangeText={setPasswordConfirm}
            value={passwordConfirm}
          />
        </Form>
        <Button 
          title="Cadastrar"
          onPress={handleRegister}
          color={colors.success}
        />
      </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}