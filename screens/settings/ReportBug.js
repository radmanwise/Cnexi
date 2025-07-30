import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';

const BugTypeButton = ({ icon, title, selected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.bugTypeButton,
      selected && styles.bugTypeButtonSelected
    ]}
    onPress={onPress}
  >
    <Feather 
      name={icon} 
      size={20} 
      color={selected ? '#2196F3' : '#666'} 
    />
    <Text style={[
      styles.bugTypeText,
      selected && styles.bugTypeTextSelected
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const ReportBugScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [bugType, setBugType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [deviceInfo, setDeviceInfo] = useState('');
  const currentDate = "2025-03-13 07:09:00";
  const username = "Mahdimoradiz";

  const handleSubmit = () => {
    if (!bugType || !title || !description) {
      Alert.alert(
        t('Missing Information'),
        t('Please fill in all required fields'),
        [{ text: t('OK') }]
      );
      return;
    }

    Alert.alert(
      t('Submit Report'),
      t('Are you sure you want to submit this bug report?'),
      [
        {
          text: t('Cancel'),
          style: 'cancel',
        },
        {
          text: t('Submit'),
          onPress: () => {
            // Here you would typically send the report to your backend
            Alert.alert(
              t('Thank You'),
              t('Your bug report has been submitted successfully'),
              [
                {
                  text: t('OK'),
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Report Bug')}</Text>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>{t('Submit')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Bug Type Selection */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>{t('BUG TYPE')} *</Text>
          <View style={styles.bugTypeContainer}>
            <BugTypeButton
              icon="alert-circle"
              title={t('Error')}
              selected={bugType === 'error'}
              onPress={() => setBugType('error')}
            />
            <BugTypeButton
              icon="alert-triangle"
              title={t('UI Issue')}
              selected={bugType === 'ui'}
              onPress={() => setBugType('ui')}
            />
            <BugTypeButton
              icon="zap"
              title={t('Performance')}
              selected={bugType === 'performance'}
              onPress={() => setBugType('performance')}
            />
            <BugTypeButton
              icon="refresh-cw"
              title={t('Crash')}
              selected={bugType === 'crash'}
              onPress={() => setBugType('crash')}
            />
          </View>
        </Animated.View>

        {/* Title Input */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>{t('TITLE')} *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.titleInput}
              placeholder={t('Brief description of the issue')}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>
        </Animated.View>

        {/* Description Input */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>{t('DESCRIPTION')} *</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.descriptionInput}
              placeholder={t('Detailed description of the bug')}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>
        </Animated.View>

        {/* Steps to Reproduce */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>{t('STEPS TO REPRODUCE')}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.stepsInput}
              placeholder={t('1.\n2.\n3.')}
              value={steps}
              onChangeText={setSteps}
              multiline
              textAlignVertical="top"
            />
          </View>
        </Animated.View>

        {/* Device Info */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>{t('DEVICE INFORMATION')}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.deviceInput}
              placeholder={t('Device model, OS version, app version')}
              value={deviceInfo}
              onChangeText={setDeviceInfo}
              multiline
              textAlignVertical="top"
            />
          </View>
        </Animated.View>

        {/* Report Info */}
        <View style={styles.reportInfo}>
          <Text style={styles.reportInfoText}>
            {t('Report by')}: @{username}
          </Text>
          <Text style={styles.reportInfoText}>
            {t('Date')}: {currentDate}
          </Text>
        </View>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('* Required fields')}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2196F3',
  },
  submitText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
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
  bugTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  bugTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    margin: 4,
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
  bugTypeButtonSelected: {
    backgroundColor: '#E3F2FD',
  },
  bugTypeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  bugTypeTextSelected: {
    color: '#2196F3',
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
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
  titleInput: {
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
  },
  descriptionInput: {
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    height: 120,
  },
  stepsInput: {
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    height: 100,
  },
  deviceInput: {
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    height: 80,
  },
  reportInfo: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  reportInfoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    letterSpacing: 0.2,
  },
});

export default ReportBugScreen;