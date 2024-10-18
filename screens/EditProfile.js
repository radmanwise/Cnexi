import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';

const EditProfile = ({ navigation }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { t } = useTranslation();


    const handleImagePicker = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setProfileImage(response.assets[0].uri);
            }
        });
    };

    const handleSaveChanges = () => {
        // Logic to save changes
        Alert.alert('Profile updated!', `Gender: ${gender}, Birth Date: ${birthDate.toDateString()}`);
        navigation.goBack();
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || birthDate;
        setShowDatePicker(false);
        setBirthDate(currentDate);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            navigation.setOptions({ tabBarStyle: { display: 'none' } });
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleImagePicker}>
                <View style={styles.profileImageContainer}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <Image source={require('../assets/user.jpg')} style={styles.profileImage}></Image>
                    )}
                </View>
            </TouchableOpacity>

            <TextInput style={styles.input} placeholder={t('Name')} placeholderTextColor="#888" />
            <TextInput style={styles.input} placeholder={t('Username')} placeholderTextColor="#888" />
            <TextInput style={styles.input} placeholder={t('Bio')} placeholderTextColor="#888" />

            {/* ورودی جنسیت */}
            <Text style={styles.label}>{t('Gender')}</Text>
            <Picker
                selectedValue={gender}
                style={styles.picker}
                onValueChange={(itemValue) => setGender(itemValue)}
            >
                <Picker.Item label={t("Select Gender")} value="" />
                <Picker.Item label={t("Male")} value="male" />
                <Picker.Item label={t("Fmale")} value="female" />
                <Picker.Item label={t("Other")} value="other" />
            </Picker>

            <Text style={styles.label}>{t('Birth Date')}</Text>
            <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
                <Text style={styles.datePickerText}>
                    {birthDate ? birthDate.toDateString() : 'Select Date'}
                </Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={birthDate}
                    mode="date"
                    display="default"
                    onChange={onChange}
                />
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>{t("Save Changes")}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    profileImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    imagePlaceholder: {
        color: '#888',
        textAlign: 'center',
    },
    input: {
        height: 55,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 15,
        padding: 10,
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        marginTop: 12,
    },
    picker: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
    },
    datePickerButton: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    datePickerText: {
        color: '#888',
    },
    saveButton: {
        backgroundColor: 'black',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default EditProfile;
