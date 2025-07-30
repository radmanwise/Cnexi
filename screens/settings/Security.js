import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

const SecurityOption = ({ title, subtitle, icon, value, onPress, type = 'toggle' }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  return (
    <Animated.View
      style={[styles.securityOption, animatedStyle]}
    >
      <TouchableOpacity
        style={styles.optionContent}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.optionLeft}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: getIconBackground(icon) }
          ]}>
            <Feather name={icon} size={22} color={getIconColor(icon)} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>{title}</Text>
            <Text style={styles.optionSubtitle}>{subtitle}</Text>
          </View>
        </View>
        {type === 'toggle' ? (
          <Switch
            value={value}
            onValueChange={onPress}
            trackColor={{ false: '#e0e0e0', true: '#bbd6fe' }}
            thumbColor={value ? '#2196F3' : '#f4f3f4'}
            ios_backgroundColor="#e0e0e0"
          />
        ) : (
          <View style={styles.arrowContainer}>
            <Feather name="chevron-right" size={20} color="#999" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const SecurityScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    biometric: false,
    loginAlerts: true,
    saveLoginInfo: true,
    passwordChange: '2025-02-13', // Last password change date
    securityLevel: 'Medium',
  });

  const handleTwoFactorAuth = () => {
    if (!securitySettings.twoFactor) {
      navigation.navigate('TwoFactorSetup');
    } else {
      Alert.alert(
        t('Disable 2FA'),
        t('Are you sure you want to disable two-factor authentication?'),
        [
          {
            text: t('Cancel'),
            style: 'cancel',
          },
          {
            text: t('Disable'),
            style: 'destructive',
            onPress: () => {
              setSecuritySettings(prev => ({
                ...prev,
                twoFactor: false,
              }));
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Security')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Security Status */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.statusCard}
        >
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>{t('Security Level')}</Text>
            <View style={[
              styles.levelBadge,
              { backgroundColor: getLevelColor(securitySettings.securityLevel) }
            ]}>
              <Text style={styles.levelText}>
                {securitySettings.securityLevel}
              </Text>
            </View>
          </View>
          <Text style={styles.lastUpdated}>
            {t('Last password change')}: {securitySettings.passwordChange}
          </Text>
        </Animated.View>

        {/* Two-Factor Authentication */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('AUTHENTICATION')}</Text>
          <SecurityOption
            icon="lock"
            title={t('Two-Factor Authentication')}
            subtitle={t('Add an extra layer of security')}
            value={securitySettings.twoFactor}
            onPress={handleTwoFactorAuth}
          />
          <SecurityOption
            icon="fingerprint"
            title={t('Biometric Login')}
            subtitle={t('Use Face ID or fingerprint')}
            value={securitySettings.biometric}
            onPress={() => setSecuritySettings(prev => ({
              ...prev,
              biometric: !prev.biometric
            }))}
          />
        </View>

        {/* Login Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('LOGIN SECURITY')}</Text>
          <SecurityOption
            icon="bell"
            title={t('Login Alerts')}
            subtitle={t('Get notified of new logins')}
            value={securitySettings.loginAlerts}
            onPress={() => setSecuritySettings(prev => ({
              ...prev,
              loginAlerts: !prev.loginAlerts
            }))}
          />
          <SecurityOption
            icon="save"
            title={t('Remember Login')}
            subtitle={t('Stay logged in on this device')}
            value={securitySettings.saveLoginInfo}
            onPress={() => setSecuritySettings(prev => ({
              ...prev,
              saveLoginInfo: !prev.saveLoginInfo
            }))}
          />
        </View>

        {/* Additional Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ADDITIONAL SECURITY')}</Text>
          <SecurityOption
            icon="key"
            title={t('Change Password')}
            subtitle={t('Update your password')}
            type="button"
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <SecurityOption
            icon="shield"
            title={t('Security Checkup')}
            subtitle={t('Review your security settings')}
            type="button"
            onPress={() => navigation.navigate('SecurityCheckup')}
          />
          <SecurityOption
            icon="activity"
            title={t('Login Activity')}
            subtitle={t('See your account activity')}
            type="button"
            onPress={() => navigation.navigate('LoginActivity')}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('Last security check')}: 2025-03-13 06:53:09
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Helper functions
const getIconBackground = (icon) => {
  const colors = {
    lock: '#E3F2FD',
    fingerprint: '#E8F5E9',
    bell: '#FFF3E0',
    save: '#F3E5F5',
    key: '#E1F5FE',
    shield: '#E8EAF6',
    activity: '#FBE9E7',
  };
  return colors[icon] || '#F5F5F5';
};

const getIconColor = (icon) => {
  const colors = {
    lock: '#2196F3',
    fingerprint: '#43A047',
    bell: '#FF9800',
    save: '#9C27B0',
    key: '#03A9F4',
    shield: '#3F51B5',
    activity: '#FF5722',
  };
  return colors[icon] || '#757575';
};

const getLevelColor = (level) => {
  const colors = {
    High: '#E8F5E9',
    Medium: '#FFF3E0',
    Low: '#FFEBEE',
  };
  return colors[level] || '#F5F5F5';
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
    paddingTop: Platform.OS === 'ios' ? 48 : 35,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
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
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#43A047',
  },
  lastUpdated: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
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
  securityOption: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
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
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionLeft: {
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
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  arrowContainer: {
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    letterSpacing: 0.2,
  },
});

export default SecurityScreen;