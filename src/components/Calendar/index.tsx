import React from 'react';
import { Calendar as CustomCalendar, LocaleConfig } from 'react-native-calendars';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';

LocaleConfig.locales['pt-BR'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['DOM','SEG','TER','QUA','QUI','SEX','SAB'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-BR';

export function Calendar(){

  const { colors, fonts } = useTheme();

  return (
    <CustomCalendar 
      renderArrow={(direction) => 
        <Feather 
          name={direction === 'left' ? 'chevron-left' : 'chevron-right'} 
          color={colors.text}
          size={24}
        />
      }
      headerStyle={{
        backgroundColor: colors.background_secondary,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.text_detail,
        paddingBottom: 10,
        marginBottom: 10
      }}

      theme={{
        textDayFontFamily: fonts.primary_400,
        textDayHeaderFontFamily: fonts.primary_500,
        textMonthFontSize: 20,
        textMonthFontFamily: fonts.secondary_600,
        monthTextColor: colors.title,
        textDayHeaderFontSize: 10,
        arrowStyle: {
          marginHorizontal: -15
        }
      }}
      firstDay={1}
      minDate={new Date()}
    />
  );
}