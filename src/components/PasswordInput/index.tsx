import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';

import {
  Container,
  Content,
  LineFocusedBorder,
  IconContainer,
  InputText,
  ChangePasswordVisibilityButton,
} from './style';

interface InputProps extends TextInputProps {
  iconName: React.ComponentProps<typeof Feather>['name'];
}

export function PasswordInput({
  iconName,
  value,
  ...rest
} : InputProps){

  const { colors } = useTheme();

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [IsPasswordVisible, setIsPasswordVisible] = useState(true);

  function handlePasswordVisibilityChange() {
    setIsPasswordVisible(old => !old);
  }

  function handleInputFocus() {
    setIsFocused(true);
  }

  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!value);
  }

  return (
    <Container>
      <Content>
        <IconContainer>
          <Feather 
            name={iconName}
            size={24}
            color={(isFocused || isFilled) ? colors.main : colors.text_detail}
          />
        </IconContainer>

        <InputText 
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          value={value}
          {...rest}
          secureTextEntry={IsPasswordVisible}
        />
        <ChangePasswordVisibilityButton onPress={handlePasswordVisibilityChange}>
          <Feather 
            name={IsPasswordVisible ? 'eye' : 'eye-off'}
            size={24}
            color={colors.text_detail}
          />
        </ChangePasswordVisibilityButton>
      </Content>
      {isFocused && (
        <LineFocusedBorder />
      )}
    </Container>
  );
}