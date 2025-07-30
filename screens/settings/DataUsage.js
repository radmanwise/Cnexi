import React, { useState } from 'react';
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
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const UsageCard = ({ title, currentUsage, limit, icon, color, delay }) => {
  const percentage = (currentUsage / limit) * 100;
  
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={[styles.usageCard]}
    >
      <View style={styles.usageHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Feather name={icon} size={20} color={color} />
        </View>
        <Text style={styles.usageTitle}>{title}</Text>
      </View>
      
      <View style={styles.usageProgressContainer}>
        <View style={[styles.usageProgressBar, { backgroundColor: color + '20' }]}>
          <Animated.View
            style={[
              styles.usageProgress,
              {
                width: `${percentage}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
        <Text style={styles.usageText}>
          {currentUsage} MB / {limit} MB
        </Text>
      </View>
    </Animated.View>
  );
};

const DataUsageScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const currentDate = "2025-03-13 07:02:12";
  const username = "Mahdimoradiz";

  // Example usage data
  const usageData = {
    storage: {
      current: 2048,
      limit: 5120,
      lastUpdated: '2 hours ago'
    },
    upload: {
      current: 750,
      limit: 2048,
      lastUpdated: '30 minutes ago'
    },
    download: {
      current: 1536,
      limit: 3072,
      lastUpdated: '15 minutes ago'
    },
    cache: {
      current: 512,
      limit: 1024,
      lastUpdated: '5 minutes ago'
    }
  };

  const [timeRange, setTimeRange] = useState('month'); // 'day', 'week', 'month', 'year'

  const TimeRangeButton = ({ range, label }) => (
    <TouchableOpacity
      style={[
        styles.timeRangeButton,
        timeRange === range && styles.timeRangeButtonActive
      ]}
      onPress={() => setTimeRange(range)}
    >
      <Text style={[
        styles.timeRangeText,
        timeRange === range && styles.timeRangeTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>{t('Data Usage')}</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Feather name="refresh-cw" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Summary Card */}
        <Animated.View
          entering={FadeIn.delay(100).springify()}
          style={styles.summaryCard}
        >
          <Text style={styles.summaryTitle}>{t('Usage Summary')}</Text>
          <Text style={styles.summarySubtitle}>@{username}</Text>
          <View style={styles.timeRangeContainer}>
            <TimeRangeButton range="day" label={t('Day')} />
            <TimeRangeButton range="week" label={t('Week')} />
            <TimeRangeButton range="month" label={t('Month')} />
            <TimeRangeButton range="year" label={t('Year')} />
          </View>
        </Animated.View>

        {/* Usage Cards */}
        <View style={styles.usageContainer}>
          <UsageCard
            title={t('Storage')}
            currentUsage={usageData.storage.current}
            limit={usageData.storage.limit}
            icon="hard-drive"
            color="#2196F3"
            delay={200}
          />
          <UsageCard
            title={t('Upload')}
            currentUsage={usageData.upload.current}
            limit={usageData.upload.limit}
            icon="upload"
            color="#4CAF50"
            delay={300}
          />
          <UsageCard
            title={t('Download')}
            currentUsage={usageData.download.current}
            limit={usageData.download.limit}
            icon="download"
            color="#FF9800"
            delay={400}
          />
          <UsageCard
            title={t('Cache')}
            currentUsage={usageData.cache.current}
            limit={usageData.cache.limit}
            icon="database"
            color="#9C27B0"
            delay={500}
          />
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>{t('TIPS TO REDUCE DATA USAGE')}</Text>
          <View style={styles.tipCard}>
            <Feather name="info" size={20} color="#2196F3" style={styles.tipIcon} />
            <Text style={styles.tipText}>
              {t('Clear cache regularly to free up space')}
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Feather name="wifi" size={20} color="#4CAF50" style={styles.tipIcon} />
            <Text style={styles.tipText}>
              {t('Use WiFi for large downloads')}
            </Text>
          </View>
        </View>

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
  headerButton: {
    padding: 8,
    marginRight: -8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  timeRangeButtonActive: {
    backgroundColor: '#2196F3',
  },
  timeRangeText: {
    fontSize: 14,
    color: '#666',
  },
  timeRangeTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  usageContainer: {
    padding: 16,
  },
  usageCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
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
  usageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  usageProgressContainer: {
    marginTop: 8,
  },
  usageProgressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  usageProgress: {
    height: '100%',
    borderRadius: 4,
  },
  usageText: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
  },
  tipsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    letterSpacing: 0.8,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
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
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    letterSpacing: 0.2,
  },
});

export default DataUsageScreen;