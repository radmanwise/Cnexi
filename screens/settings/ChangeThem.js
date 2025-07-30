import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ScrollView,
  Animated, 
  Easing,
} from 'react-native';
import { ThemeProvider, useTheme } from './ThemeContext';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';

const ThemeOption = ({ selected, icon, label, onPress }) => {
  const { theme } = useTheme();
  const [scaleAnim] = React.useState(new Animated.Value(1));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.themeOption,
        { backgroundColor: theme.secondary }
      ]}
      activeOpacity={0.9}
    >
      <Animated.View style={[
        styles.optionContent,
        { transform: [{ scale: scaleAnim }] }
      ]}>
        <View style={styles.optionLeft}>
          {icon}
          <Text style={[styles.optionText, { color: theme.text }]}>
            {label}
          </Text>
        </View>
        <View style={[
          styles.radioButton,
          { borderColor: theme.border }
        ]}>
          {selected && (
            <View style={[
              styles.radioButtonInner,
              { backgroundColor: theme.button }
            ]} />
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const ThemeSwitcher = () => {
  const { theme, themeMode, setThemeMode } = useTheme();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.primary }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Display Settings
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Choose your preferred theme mode
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <ThemeOption
          selected={themeMode === 'light'}
          icon={
            <Ionicons name="sunny" size={24} color={theme.text} />
          }
          label="Light Mode"
          onPress={() => setThemeMode('light')}
        />

        <ThemeOption
          selected={themeMode === 'dark'}
          icon={
            <MaterialCommunityIcons
              name="moon-waning-crescent"
              size={24}
              color={theme.text}
            />
          }
          label="Dark Mode"
          onPress={() => setThemeMode('dark')}
        />

        <ThemeOption
          selected={themeMode === 'system'}
          icon={
            <Feather name="smartphone" size={24} color={theme.text} />
          }
          label="System Default"
          onPress={() => setThemeMode('system')}
        />
      </View>

      <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>
          About Theme Settings
        </Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          • Light Mode: Bright theme for better visibility in daylight
        </Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          • Dark Mode: Easier on the eyes in low-light conditions
        </Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          • System Default: Automatically matches your device settings
        </Text>
      </View>

      <View style={[styles.tipsCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>
          Tips
        </Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          • Dark mode can help reduce eye strain at night
        </Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          • System default will automatically switch based on your device settings
        </Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          • Light mode is recommended for high-contrast viewing
        </Text>
      </View>
    </ScrollView>
  );
};

export default function ChangeThem() {
  return (
    <ThemeProvider>
      <ThemeSwitcher />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  themeOption: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tipsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
});