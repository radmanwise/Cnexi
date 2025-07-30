import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOutDown,
} from 'react-native-reanimated';

const AccountActionButton = ({ icon, title, subtitle, onPress, destructive, loading }) => (
  <Animated.View
    entering={FadeInDown.delay(200).springify()}
    style={[
      styles.actionButton,
      destructive && styles.destructiveButton
    ]}
  >
    <TouchableOpacity
      style={styles.actionTouchable}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.actionContent}>
        <View style={[
          styles.actionIcon,
          destructive && styles.destructiveIcon
        ]}>
          <Feather
            name={icon}
            size={22}
            color={destructive ? '#FF3B30' : '#2196F3'}
          />
        </View>
        <View style={styles.actionText}>
          <Text style={[
            styles.actionTitle,
            destructive && styles.destructiveText
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.actionSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {loading ? (
        <ActivityIndicator color="#999" />
      ) : (
        <Feather
          name="chevron-right"
          size={20}
          color="#999"
        />
      )}
    </TouchableOpacity>
  </Animated.View>
);

const AccountScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      t('Logout'),
      t('Are you sure you want to logout?'),
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('Logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await SecureStore.deleteItemAsync('token');
              navigation.navigate('LoginScreen');
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert(t('Error'), t('Failed to logout. Please try again.'));
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('Delete Account'),
      t('This action cannot be undone. Are you sure?'),
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('Delete'),
          style: 'destructive',
          onPress: () => {
            // Implement account deletion logic
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('Account')}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Account Section */}
        <Animated.View
          entering={FadeIn.delay(100).springify()}
          style={styles.currentAccount}
        >
          <Image
            source={{ uri: 'https://your-avatar-url.com' }}
            style={styles.avatar}
          />
          <View style={styles.accountInfo}>
            <Text style={styles.username}>@Mahdimoradiz</Text>
            <Text style={styles.email}>user@example.com</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t('Active')}</Text>
          </View>
        </Animated.View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('ACCOUNT MANAGEMENT')}</Text>
          
          <AccountActionButton
            icon="user-plus"
            title={t('Add Another Account')}
            subtitle={t('Connect multiple accounts')}
            onPress={() => navigation.navigate('AddAccount')}
          />

          <AccountActionButton
            icon="refresh-ccw"
            title={t('Switch Account')}
            subtitle={t('Change to another account')}
            onPress={() => navigation.navigate('SwitchAccount')}
          />

          <AccountActionButton
            icon="log-out"
            title={t('Logout')}
            subtitle={t('Sign out of your account')}
            onPress={handleLogout}
            loading={loading}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('DANGER ZONE')}</Text>
          
          <AccountActionButton
            icon="trash-2"
            title={t('Delete Account')}
            subtitle={t('Permanently remove your account')}
            onPress={handleDeleteAccount}
            destructive
          />
        </View>

        {/* Account Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            {t('Last login')}: 2025-03-13 06:26:16
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 35,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  currentAccount: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  accountInfo: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#43A047',
    fontSize: 12,
    fontWeight: '600',
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
  actionButton: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
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
  destructiveButton: {
    backgroundColor: '#FFF5F5',
  },
  actionTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: '#FFE5E5',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  destructiveText: {
    color: '#FF3B30',
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  infoSection: {
    marginTop: 32,
    marginBottom: 16,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    letterSpacing: 0.2,
  },
});

export default AccountScreen;