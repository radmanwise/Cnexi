import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigation = useNavigation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fa', label: 'فارسی' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'ar', label: 'العربية' },
    { code: 'ru', label: 'Russian' },
    { code: 'zh', label: 'Chinese (PRC)' },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    navigation.navigate('home');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => changeLanguage(item.code)}
          >
            <Text style={styles.text}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  button: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '110%',
    marginLeft: 25,
  },
  text: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
  },
});

export default LanguageSwitcher;
