import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';
import * as Yup from 'yup';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Alert, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { BackButton } from '../../components/BackButton';
import { Input } from '../../components/Input';
import { PasswordInput } from '../../components/PasswordInput';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Header,
  HeaderTop,
  HeaderTitle,
  LogoutButton,
  PhotoContainer,
  Photo,
  PhotoButton,
  Content,
  Options,
  Option,
  OptionTitle,
  Section
} from './style';
import { Button } from '../../components/Button';
import { useNetInfo } from '@react-native-community/netinfo';

export function Profile(){

  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user, signOut, updateUser } = useAuth();
  const netInfo = useNetInfo();

  const [avatar, setAvatar] = useState(user.avatar);
  const [name, setName] = useState(user.name);
  const [driverLicense, setDriverLicense] = useState(user.driver_license);

  const [option, setOption] = useState<'details' | 'password'>('details');

  function handleBack() {
    navigation.goBack();
  }

  function handleOption(selected: 'details' | 'password') {
    if(!netInfo.isConnected === true && selected === 'password') {
      return Alert.alert('Você está offiline', 'Para trocar a senha conecte-se a internet');
    }
    
    setOption(selected);
  }
  
  async function handleSignOut() {
    try {

      Alert.alert(
        'Tem certeza?', 
        'Se você sair irá precisar de internet para conectar-se novamente',
        [{
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => {}
        },
        {
          text: 'Sair',
          style: 'default',
          onPress: async () => {
            await signOut();
          }
        }]
      );

    } catch {}
  }

  async function handleSelectAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1
    });

    if(result.cancelled) {
      return;
    }

    if(result.uri) {
      updateUser({ ...user, avatar: result.uri });
      setAvatar(result.uri);
    }
  }

  async function handleProfileUpdate() {
    try {

      const schema = Yup.object().shape({
        driverLicense: Yup.string()
          .required('CNH é obrigatória'),
        name: Yup.string()
          .required('Nome é obrigatório')
      });

      const data = { name, driverLicense };

      await schema.validate(data);

      await updateUser({
        ...user,
        name: name,
        driver_license: driverLicense,
        avatar: avatar
      });

      Alert.alert('Alteração', 'Perfil atualizado!');

    } catch(error: any) {

      if(error instanceof Yup.ValidationError) {
        Alert.alert('Validação', error.message);
      } else {
        Alert.alert('Alteração de cadastro', 'Não foi possível atualizar o perfil');
      }
    }
  }

  return (
    <KeyboardAvoidingView behavior="position" enabled>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Header>
            <HeaderTop>
              <BackButton color={colors.shape} onPress={handleBack} />
              <HeaderTitle>Editar perfil</HeaderTitle>
              <LogoutButton onPress={handleSignOut}>
                <Feather 
                  name="power" 
                  size={24} 
                  color={colors.shape}
                />
              </LogoutButton>
            </HeaderTop>
            <PhotoContainer>
              {!!avatar && <Photo source={{ uri: avatar }} />}
              <PhotoButton onPress={handleSelectAvatar}>
                <Feather 
                  name="camera"
                  size={20}
                  color={colors.shape}
                />
              </PhotoButton>
            </PhotoContainer>
          </Header>
          <Content style={{ marginBottom: useBottomTabBarHeight() }}>
            <Options>
              <Option 
                activeOpacity={0.7}
                onPress={() => handleOption('details')} 
                active={option === 'details'}
              >
                <OptionTitle 
                  active={option === 'details'}
                >
                  Dados
                </OptionTitle>
              </Option>
              <Option 
                activeOpacity={0.7}
                onPress={() => handleOption('password')} 
                active={option === 'password'}
              >
                <OptionTitle 
                  active={option === 'password'}
                >
                    Trocar senha
                  </OptionTitle>
              </Option>
            </Options>
            {option === 'details' ?
              <Section>
                <Input 
                  iconName="user"
                  placeholder="nome"
                  autoCapitalize="none"
                  autoCorrect={false}
                  defaultValue={user.name}
                  value={name}
                  onChangeText={setName}
                />
                <Input 
                  iconName="mail"
                  editable={false}
                  defaultValue={user.email}
                />
                <Input 
                  iconName="credit-card"
                  placeholder="CNH"
                  keyboardType="numeric"
                  defaultValue={user.driver_license}
                  value={driverLicense}
                  onChangeText={setDriverLicense}
                />
              </Section>
              :
              <Section>
                <PasswordInput
                  iconName="lock"
                  placeholder="Senha atual"
                  autoCorrect={false}
                />
                <PasswordInput
                  iconName="lock"
                  placeholder="Nova senha"
                  autoCorrect={false}
                />
                <PasswordInput
                  iconName="lock"
                  placeholder="Repetir senha"
                  autoCorrect={false}
                />
              </Section>
            }
            <Button 
              title="Salvar alterações"
              onPress={handleProfileUpdate}
            />
          </Content>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}