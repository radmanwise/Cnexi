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
import { Title, Subtitle } from '../../components/ui/Typography'

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
          <Title style={styles.settingText}>{title}</Title>
          {subtitle && <Subtitle style={styles.settingSubtext}>{subtitle}</Subtitle>}
        </View>
      </View>
      <View style={styles.rightContainer}>
        {badgeCount > 0 && (
          <View style={styles.badge}>
            <Subtitle style={styles.badgeText}>{badgeCount}</Subtitle>
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
    <Title style={styles.sectionTitle}>{title}</Title>
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
          <Subtitle style={styles.versionText}>Version 0.1.5</Subtitle>
        </View>
      </ScrollView>
    </View>
  );
};

const getIconBackground = (iconName) => {
  const colors = {
    sun: '#ffffffff',
    'block-flipped': '#ffffffff',
    'account-circle-outline': '#ffffffff',
    'language-sharp': '#ffffffff',
    star: '#ffffffff',
    'pie-chart': '#ffffffff',
    exclamationcircleo: '#ffffffff',
    'bug-report': '#ffffffff',
    security: '#ffffffff',
    bell: '#ffffffff',
    'data-usage': '#ffffffff',
    'log-out': '#ffffffff',
  };
  return colors[iconName] || '#ffffffff';
};

const getIconColor = (iconName) => {
  const colors = {
    sun: '#3a3a3aff',
    'block-flipped': '#3a3a3aff',
    'account-circle-outline': '#3a3a3aff',
    'language-sharp': '#3a3a3aff',
    star: '#3a3a3aff',
    'pie-chart': '#3a3a3aff',
    exclamationcircleo: '#3a3a3aff',
    'bug-report': '#3a3a3aff',
    security: '#3a3a3aff',
    bell: '#3a3a3aff',
    'data-usage': '#3a3a3aff',
    'log-out': '#3a3a3aff',
  };
  return colors[iconName] || '#757575';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefefff',
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    top: 33
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
    letterSpacing: 0.8,
  },
  sectionContent: {
    borderRadius: 16,
    marginHorizontal: 16,
    backgroundColor: '#ffffffff',
    elevation: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0,
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
    fontSize: 14,
    color: '#666666ff',
  },
  settingSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
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
  },
  dateText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
});

export default SettingsScreen;