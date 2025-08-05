import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';

const InfoItem = ({ icon, title, value, link, delay }) => (
  <Animated.View
    entering={FadeInDown.delay(delay).springify()}
    style={styles.infoItem}
  >
    <View style={styles.infoIconContainer}>
      <Feather name={icon} size={20} color="#2196F3" />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoTitle}>{title}</Text>
      {link ? (
        <TouchableOpacity onPress={() => Linking.openURL(link)}>
          <Text style={[styles.infoValue, styles.infoLink]}>{value}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.infoValue}>{value}</Text>
      )}
    </View>
  </Animated.View>
);

const AboutScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  
  const appInfo = {
    version: '1.0.0',
    buildNumber: '100',
    lastUpdate: '2025-03-13',
    developer: 'Mehdi Moradi',
    company: 'NexVers',
    website: 'https://NexVers.com',
    email: 'support@NexVers.com',
    currentDate: '2025-03-13 07:05:02',
    username: 'Mahdimoradiz',
  };

  return (
    <View style={styles.container}>


      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* App Logo and Title */}
        <Animated.View
          entering={FadeIn.delay(100).springify()}
          style={styles.logoContainer}
        >
          <Image
            source={require('../../assets/img/app/cnexi.png')}
            style={styles.logo}
          />
          <Text style={styles.appName}>{t('Nex')}</Text>
          <Text style={styles.appVersion}>
            {t('Version')} {appInfo.version} ({appInfo.buildNumber})
          </Text>
        </Animated.View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('APP INFORMATION')}</Text>
          <View style={styles.card}>
            <InfoItem
              icon="info"
              title={t('Version')}
              value={`${appInfo.version} (${appInfo.buildNumber})`}
              delay={200}
            />
            <InfoItem
              icon="clock"
              title={t('Last Update')}
              value={appInfo.lastUpdate}
              delay={250}
            />
            <InfoItem
              icon="cpu"
              title={t('Build Number')}
              value={appInfo.buildNumber}
              delay={300}
            />
          </View>
        </View>

        {/* Developer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('DEVELOPER')}</Text>
          <View style={styles.card}>
            <InfoItem
              icon="user"
              title={t('Developer')}
              value={appInfo.developer}
              delay={350}
            />
            <InfoItem
              icon="briefcase"
              title={t('Company')}
              value={appInfo.company}
              delay={400}
            />
            <InfoItem
              icon="globe"
              title={t('Website')}
              value={appInfo.website}
              link={appInfo.website}
              delay={450}
            />
            <InfoItem
              icon="mail"
              title={t('Support')}
              value={appInfo.email}
              link={`mailto:${appInfo.email}`}
              delay={500}
            />
          </View>
        </View>

        {/* Legal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('LEGAL')}</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.legalButton}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              <Feather name="shield" size={20} color="#2196F3" />
              <Text style={styles.legalButtonText}>{t('Privacy Policy')}</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.legalButton}
              onPress={() => navigation.navigate('TermsOfService')}
            >
              <Feather name="file-text" size={20} color="#2196F3" />
              <Text style={styles.legalButtonText}>{t('Terms of Service')}</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.legalButton}
              onPress={() => navigation.navigate('Licenses')}
            >
              <Feather name="book" size={20} color="#2196F3" />
              <Text style={styles.legalButtonText}>{t('Licenses')}</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => Linking.openURL('https://twitter.com/yourapp')}
          >
            <Feather name="twitter" size={24} color="#1DA1F2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => Linking.openURL('https://instagram.com/yourapp')}
          >
            <Feather name="instagram" size={24} color="#E1306C" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => Linking.openURL('https://github.com/yourapp')}
          >
            <Feather name="github" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('Last updated')}: {appInfo.currentDate}
          </Text>
          <Text style={styles.footerText}>@{appInfo.username}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
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
  scrollContent: {
    paddingBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 16,
  },
  appVersion: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
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
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginTop: 2,
  },
  infoLink: {
    color: '#2196F3',
  },
  legalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  legalButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginLeft: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
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
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
});

export default AboutScreen;