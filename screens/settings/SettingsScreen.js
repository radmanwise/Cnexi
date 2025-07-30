import React, { useEffect } from 'react';
import { Feather, MaterialIcons, MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import * as Updates from 'expo-updates';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const SettingItem = ({ icon: Icon, iconName, title, onPress, delay, subtitle, badgeCount }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scale.value = withSpring(1, {
        mass: 0.5,
        damping: 12,
        stiffness: 100,
      });
      opacity.value = withTiming(1, { duration: 400 });
    }, delay);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedTouchable
      style={[styles.settingItem, animatedStyle]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingContent}>
        <View style={[styles.iconContainer, { backgroundColor: getIconBackground(iconName) }]}>
          <Icon name={iconName} size={22} color={getIconColor(iconName)} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.settingText}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtext}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.rightContainer}>
        {badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
        <View style={styles.arrowContainer}>
          <Feather name="chevron-right" size={20} color="#99999999" />
        </View>
      </View>
    </AnimatedTouchable>
  );
};

const SettingsSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const currentDate = new Date().toISOString().split('T')[0];

  const handleLogout = async () => {
    Alert.alert(
      t('Logout'),
      t('Are you sure you want to logout?'),
      [
        {
          text: t('Cancel'),
          style: 'cancel'
        },
        {
          text: t('Logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync('token');

              await Updates.reloadAsync();
              
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert(t('Error'), t('Could not logout. Please try again.'));
            }
          }
        }
      ]
    );
  };

  const settingsData = [
    {
      title: t('Appearance'),
      items: [
        {
          icon: Feather,
          iconName: 'sun',
          title: t('Theme'),
          subtitle: t('Dark mode, Light mode, System'),
          onPress: () => navigation.navigate('ChangeThem'),
        },
      ],
    },
    {
      title: t('Privacy & Security'),
      items: [
        {
          icon: MaterialIcons,
          iconName: 'block-flipped',
          title: t('Block'),
          subtitle: t('Manage blocked accounts'),
          onPress: () => navigation.navigate('Block'),
          badgeCount: 2,
        },
        {
          icon: MaterialCommunityIcons,
          iconName: 'account-circle-outline',
          title: t('Account'),
          subtitle: t('Security and privacy settings'),
          onPress: () => navigation.navigate('Account'),
        },
        {
          icon: MaterialIcons,
          iconName: 'security',
          title: t('Security'),
          subtitle: t('2FA and security settings'),
          onPress: () => navigation.navigate('Security'),
        },
      ],
    },
    {
      title: t('Preferences'),
      items: [
        {
          icon: Ionicons,
          iconName: 'language-sharp',
          title: t('Language'),
          subtitle: t('Change app language'),
          onPress: () => navigation.navigate('LanguageSwitcher'),
        },
        {
          icon: Feather,
          iconName: 'star',
          title: t('Favorites'),
          subtitle: t('Manage your favorites'),
          onPress: () => navigation.navigate('Favorites'),
        },
        {
          icon: Feather,
          iconName: 'bell',
          title: t('Notifications'),
          subtitle: t('Manage notifications'),
          onPress: () => navigation.navigate('Notifications'),
          badgeCount: 5,
        },
      ],
    },
    {
      title: t('Account & Data'),
      items: [
        {
          icon: Feather,
          iconName: 'pie-chart',
          title: t('Account status'),
          subtitle: t('View account statistics'),
          onPress: () => navigation.navigate('AccountStatus'),
        },
        {
          icon: MaterialIcons,
          iconName: 'data-usage',
          title: t('Data usage'),
          subtitle: t('Manage data settings'),
          onPress: () => navigation.navigate('DataUsage'),
        },
      ],
    },
    {
      title: t('Support & About'),
      items: [
        {
          icon: AntDesign,
          iconName: 'exclamationcircleo',
          title: t('About'),
          subtitle: t('App information and credits'),
          onPress: () => navigation.navigate('About'),
        },
        {
          icon: MaterialIcons,
          iconName: 'bug-report',
          title: t('Report bug'),
          subtitle: t('Help us improve'),
          onPress: () => navigation.navigate('ReportBug'),
        },
        {
          icon: Feather,
          iconName: 'log-out',
          title: t('Logout'),
          subtitle: t('Sign out of your account'),
          onPress: handleLogout,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>


      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {settingsData.map((section, sectionIndex) => (
          <SettingsSection key={sectionIndex} title={section.title}>
            {section.items.map((item, itemIndex) => (
              <SettingItem
                key={itemIndex}
                icon={item.icon}
                iconName={item.iconName}
                title={item.title}
                subtitle={item.subtitle}
                onPress={item.onPress}
                delay={sectionIndex * 100 + itemIndex * 50}
                badgeCount={item.badgeCount || 0}
              />
            ))}
          </SettingsSection>
        ))}

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const getIconBackground = (iconName) => {
  const colors = {
    sun: '#FFF8E1',
    'block-flipped': '#FFE5E5',
    'account-circle-outline': '#E8F5E9',
    'language-sharp': '#E3F2FD',
    star: '#FFF3E0',
    'pie-chart': '#F3E5F5',
    exclamationcircleo: '#E1F5FE',
    'bug-report': '#FFEBEE',
    security: '#EDE7F6',
    bell: '#FFF3E0',
    'data-usage': '#E0F2F1',
    'log-out': '#FFEBEE',
  };
  return colors[iconName] || '#F5F5F5';
};

const getIconColor = (iconName) => {
  const colors = {
    sun: '#FFB300',
    'block-flipped': '#F44336',
    'account-circle-outline': '#43A047',
    'language-sharp': '#1E88E5',
    star: '#FF9800',
    'pie-chart': '#9C27B0',
    exclamationcircleo: '#03A9F4',
    'bug-report': '#E53935',
    security: '#5E35B1',
    bell: '#FF9800',
    'data-usage': '#00897B',
    'log-out': '#D32F2F',
  };
  return colors[iconName] || '#757575';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    backgroundColor: '#FAFAFA',
    top: 33
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'sans-serif-medium',
        includeFontPadding: false,
      },
    }),
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'sans-serif-medium',
        includeFontPadding: false,
      },
    }),
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
    letterSpacing: -0.2,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'sans-serif',
        includeFontPadding: false,
      },
    }),
  },
  settingSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#FF3B30',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  arrowContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  versionContainer: {
    marginTop: 40,
    alignItems: 'center',
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
    letterSpacing: 0.2,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  dateText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
});

export default SettingsScreen;