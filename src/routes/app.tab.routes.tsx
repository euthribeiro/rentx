import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'styled-components';

import HomeSvg from '../assets/home.svg';
import CarSvg from '../assets/car.svg';
import PeopleSvg from '../assets/people.svg';

import { Home } from '../screens/Home';
import { MyCars } from '../screens/MyCars';
import { Profile } from '../screens/Profile';
import { AppStackRoutes } from './app.stack.routes';
import { Platform } from 'react-native';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppTabRoutes() {

  const { colors } = useTheme();

  return (
    <Navigator 
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: colors.main,
        inactiveTintColor: colors.text_detail,
        showLabel: false,
        style: {
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          height: 78,
          backgroundColor: colors.background_primary
        }
      }}  
    >
      <Screen 
        name="Home" 
        component={AppStackRoutes}
        options={{
          tabBarIcon: ({ color }) => <HomeSvg fill={color} width={24} height={24} /> 
        }}
      />
      <Screen 
        name="MyCars"
        component={MyCars}
        options={{
          tabBarIcon: ({ color }) => <CarSvg fill={color} width={24} height={24} /> 
        }}
      />
      <Screen 
        name="Profile" 
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => <PeopleSvg fill={color} width={24} height={24} /> 
        }}
      />
    </Navigator>
  )
}