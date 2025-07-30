import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInRight,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const LanguageItem = ({ language, isSelected, onSelect, index }) => {
  const scale = useSharedValue(0.8);
  
  useEffect(() => {
    scale.value = withSpring(1, {
      mass: 0.5,
      damping: 12,
      stiffness: 100,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      style={[
        styles.languageItem,
        isSelected && styles.selectedLanguage,
        animatedStyle,
      ]}
      onPress={onSelect}
      entering={FadeInRight.delay(index * 100).springify()}
    >
      <View style={styles.languageContent}>
        <View style={[styles.flagContainer, isSelected && styles.selectedFlagContainer]}>
          <Text style={styles.flagEmoji}>{getLanguageEmoji(language.code)}</Text>
        </View>
        <View style={styles.languageInfo}>
          <Text style={[styles.languageLabel, isSelected && styles.selectedText]}>
            {language.label}
          </Text>
          <Text style={styles.languageNative}>
            {getLanguageNativeName(language.code)}
          </Text>
        </View>
      </View>
      {isSelected && (
        <View style={styles.checkmark}>
          <Feather name="check" size={20} color="#2196F3" />
        </View>
      )}
    </AnimatedTouchable>
  );
};

const LanguageSwitcherScreen = () => {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'fa', label: 'Persian', native: 'فارسی' },
    { code: 'es', label: 'Spanish', native: 'Español' },
    { code: 'fr', label: 'French', native: 'Français' },
    { code: 'de', label: 'German', native: 'Deutsch' },
    { code: 'ar', label: 'Arabic', native: 'العربية' },
    { code: 'ru', label: 'Russian', native: 'Русский' },
    { code: 'zh', label: 'Chinese', native: '中文' },
    { code: 'ja', label: 'Japanese', native: '日本語' },
    { code: 'ko', label: 'Korean', native: '한국어' },
  ];

  const changeLanguage = async (lng) => {
    try {
      await i18n.changeLanguage(lng);
      navigation.navigate('home');
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const ListHeader = () => (
    <Animated.View
      entering={FadeInDown.springify()}
      style={styles.headerContainer}
    >
      <Text style={styles.headerTitle}>{t('Select Language')}</Text>
      <Text style={styles.headerSubtitle}>
        {t('Choose your preferred language')}
      </Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item, index }) => (
          <LanguageItem
            language={item}
            isSelected={i18n.language === item.code}
            onSelect={() => changeLanguage(item.code)}
            index={index}
          />
        )}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

// Helper function to get language emoji flag
const getLanguageEmoji = (code) => {
  const flags = {
    en: '🇺🇸',
    fa: '🇮🇷',
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    ar: '🇸🇦',
    ru: '🇷🇺',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷',
  };
  return flags[code] || '🌐';
};

// Helper function to get native language name
const getLanguageNativeName = (code) => {
  const natives = {
    en: 'English',
    fa: 'فارسی',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    ar: 'العربية',
    ru: 'Русский',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
  };
  return natives[code] || code;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    top: 20
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  languageItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedLanguage: {
    backgroundColor: '#E3F2FD',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedFlagContainer: {
    backgroundColor: '#fff',
  },
  flagEmoji: {
    fontSize: 24,
  },
  languageInfo: {
    flex: 1,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  languageNative: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  selectedText: {
    color: '#2196F3',
    fontWeight: '600',
  },
  checkmark: {
    marginLeft: 12,
  },
});

export default LanguageSwitcherScreen;