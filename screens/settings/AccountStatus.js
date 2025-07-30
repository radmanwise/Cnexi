import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  withSpring,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StatCard = ({ icon, title, value, subtitle, color, delay }) => (
  <Animated.View
    entering={FadeInDown.delay(delay).springify()}
    style={[styles.statCard, { backgroundColor: color }]}
  >
    <View style={styles.statHeader}>
      <Feather name={icon} size={24} color="#fff" />
      <Text style={styles.statTitle}>{title}</Text>
    </View>
    <Text style={styles.statValue}>{value}</Text>
    {subtitle && (
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    )}
  </Animated.View>
);

const AccountStatusScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const scrollY = useSharedValue(0);

  const currentDate = "2025-03-13 06:59:21";
  const username = "Mahdimoradiz";

  // Example stats data
  const accountStats = {
    daysActive: 365,
    totalFollowers: 1234,
    totalFollowing: 567,
    postsCount: 89,
    engagementRate: "4.5%",
    averageLikes: 45,
    totalViews: "12.5K",
    accountAge: "1 year, 2 months",
    lastActive: "2 hours ago",
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
        <Text style={styles.headerTitle}>{t('Account Stats')}</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Feather name="share-2" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info Card */}
        <Animated.View
          entering={FadeIn.delay(100).springify()}
          style={styles.userCard}
        >
          <View style={styles.userInfo}>
            <Text style={styles.username}>@{username}</Text>
            <Text style={styles.userDate}>{t('Member since')} {accountStats.accountAge}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{t('Active')}</Text>
          </View>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="users"
            title={t('Followers')}
            value={accountStats.totalFollowers}
            subtitle={t('Total followers')}
            color="#2196F3"
            delay={200}
          />
          <StatCard
            icon="user-plus"
            title={t('Following')}
            value={accountStats.totalFollowing}
            subtitle={t('Total following')}
            color="#4CAF50"
            delay={300}
          />
          <StatCard
            icon="image"
            title={t('Posts')}
            value={accountStats.postsCount}
            subtitle={t('Total posts')}
            color="#FF9800"
            delay={400}
          />
          <StatCard
            icon="heart"
            title={t('Engagement')}
            value={accountStats.engagementRate}
            subtitle={t('Average rate')}
            color="#E91E63"
            delay={500}
          />
          <StatCard
            icon="thumbs-up"
            title={t('Avg. Likes')}
            value={accountStats.averageLikes}
            subtitle={t('Per post')}
            color="#9C27B0"
            delay={600}
          />
          <StatCard
            icon="eye"
            title={t('Views')}
            value={accountStats.totalViews}
            subtitle={t('Total views')}
            color="#795548"
            delay={700}
          />
        </View>

        {/* Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('RECENT ACTIVITY')}</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <Feather name="clock" size={20} color="#666" />
              <Text style={styles.activityText}>
                {t('Last active')}: {accountStats.lastActive}
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Feather name="calendar" size={20} color="#666" />
              <Text style={styles.activityText}>
                {t('Days active')}: {accountStats.daysActive} {t('days')}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('Last updated')}: {currentDate}
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
  shareButton: {
    padding: 8,
    marginRight: -8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  userDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#43A047',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    margin: 8,
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
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
  activityCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
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
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    letterSpacing: 0.2,
  },
});

export default AccountStatusScreen;