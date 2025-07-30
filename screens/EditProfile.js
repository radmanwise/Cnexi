import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
    Switch,
    Modal
} from 'react-native';
import ipconfig from '../config/ipconfig';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Feather, AntDesign } from '@expo/vector-icons';

const THEME_COLORS = {
    primary: '#fe2c55',
    text: '#1a1a1a',
    textSecondary: '#666666',
    background: '#ffffff',
    inputBg: '#f9f9f9',
    border: '#e5e5e5',
};

const EditProfile = ({ route }) => {
    const { username } = route.params;
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        picture: null,
        username_i: '',
        isPrivate: false,
        birthday: new Date(),
        gender: '',
        website: '',
    });

    const [loading, setLoading] = useState(true);
    const [showDateModal, setShowDateModal] = useState(false);
    const [tempDate, setTempDate] = useState(new Date());
    const [showGenderModal, setShowGenderModal] = useState(false);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (!token) {
                console.error('No authentication token found.');
                return;
            }

            const response = await fetch(`${ipconfig.BASE_URL}/profile/${username}/edit/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setFormData({
                name: data.name || '',
                bio: data.bio || '',
                picture: data.picture,
                username_i: data.username_i || '',
                isPrivate: data.isPrivate || false,
                birthday: data.birthday ? new Date(data.birthday) : new Date(),
                gender: data.gender || '',
                website: data.website || '',
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (username) fetchProfileData();
    }, [username]);

    const handleSubmit = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            if (!token) {
                console.error('No authentication token found.');
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('bio', formData.bio);
            formDataToSend.append('username_i', formData.username_i);
            formDataToSend.append('isPrivate', formData.isPrivate.toString());
            
            const dateString = formData.birthday instanceof Date && !isNaN(formData.birthday) 
                ? formData.birthday.toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];
            formDataToSend.append('birthday', dateString);
            
            formDataToSend.append('gender', formData.gender || '');
            formDataToSend.append('website', formData.website || '');
            
            if (formData.picture && formData.picture.uri) {
                formDataToSend.append('picture', {
                    uri: formData.picture.uri,
                    type: 'image/jpeg', 
                    name: 'profile-picture.jpg'
                });
            }

            const response = await fetch(`${ipconfig.BASE_URL}/profile/${username}/edit/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            if (response.ok) {
                Alert.alert('Success', 'Profile updated successfully');
            } else {
                const errorData = await response.json();
                console.error('Error updating profile:', errorData);
                Alert.alert('Error', 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setFormData(prev => ({
                    ...prev,
                    picture: { uri: result.assets[0].uri }
                }));
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date)) {
            return 'Not set';
        }
        try {
            return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Not set';
        }
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.imageSection}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={formData.picture ? { uri: formData.picture.uri } : require('../assets/img/static/user.jpg')}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity
                            style={styles.editImageButton}
                            onPress={pickImage}
                        >
                            <MaterialIcons name="camera-alt" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Basic Info</Text>
                <View style={styles.formSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(text) => setFormData({ ...formData, name: text })}
                            placeholder="Enter your name"
                            placeholderTextColor="#666"
                            maxLength={30}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.username_i}
                            onChangeText={(text) => setFormData({ ...formData, username_i: text })}
                            placeholder="Enter username"
                            placeholderTextColor="#666"
                            maxLength={30}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.bioInput]}
                            value={formData.bio}
                            onChangeText={(text) => setFormData({ ...formData, bio: text })}
                            placeholder="Write something about yourself"
                            placeholderTextColor="#666"
                            multiline
                            maxLength={150}
                        />
                        <Text style={styles.charCount}>{formData.bio.length}/150</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Additional Info</Text>
                <View style={styles.formSection}>
                    <TouchableOpacity 
                        style={styles.optionItem}
                        onPress={() => {
                            setTempDate(formData.birthday);
                            setShowDateModal(true);
                        }}
                    >
                        <View style={styles.optionLeft}>
                            <Feather name="calendar" size={20} color="#666" />
                            <Text style={styles.optionText}>Birthday</Text>
                        </View>
                        <Text style={styles.optionValue}>
                            {formatDate(formData.birthday)}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.optionItem}
                        onPress={() => setShowGenderModal(true)}
                    >
                        <View style={styles.optionLeft}>
                            <Feather name="user" size={20} color="#666" />
                            <Text style={styles.optionText}>Gender</Text>
                        </View>
                        <Text style={styles.optionValue}>
                            {formData.gender || 'Not set'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.optionItem}>
                        <View style={styles.optionLeft}>
                            <Feather name="lock" size={20} color="#666" />
                            <Text style={styles.optionText}>Private Account</Text>
                        </View>
                        <Switch
                            value={formData.isPrivate}
                            onValueChange={(value) => 
                                setFormData({ ...formData, isPrivate: value })
                            }
                            trackColor={{ false: "#767577", true: "#fe2c55" }}
                            thumbColor="#f4f3f4"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Website</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.website}
                            onChangeText={(text) => setFormData({ ...formData, website: text })}
                            placeholder="Enter your website"
                            placeholderTextColor="#666"
                        />
                    </View>
                </View>
            </View>

            <Modal
                visible={showDateModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Birthday</Text>
                        <View style={styles.datePickerContainer}>
                            <TouchableOpacity 
                                style={styles.dateArrow}
                                onPress={() => {
                                    const newDate = new Date(tempDate);
                                    newDate.setDate(tempDate.getDate() - 1);
                                    setTempDate(newDate);
                                }}
                            >
                                <AntDesign name="left" size={24} color="#666" />
                            </TouchableOpacity>
                            
                            <View style={styles.dateDisplay}>
                                <Text style={styles.dateText}>
                                    {months[tempDate.getMonth()]} {tempDate.getDate()}, {tempDate.getFullYear()}
                                </Text>
                            </View>

                            <TouchableOpacity 
                                style={styles.dateArrow}
                                onPress={() => {
                                    const newDate = new Date(tempDate);
                                    newDate.setDate(tempDate.getDate() + 1);
                                    setTempDate(newDate);
                                }}
                            >
                                <AntDesign name="right" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setShowDateModal(false)}
                            >
                                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonConfirm]}
                                onPress={() => {
                                    setFormData({ ...formData, birthday: tempDate });
                                    setShowDateModal(false);
                                }}
                            >
                                <Text style={styles.modalButtonTextConfirm}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showGenderModal}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Gender</Text>
                        {genderOptions.map((gender) => (
                            <TouchableOpacity
                                key={gender}
                                style={styles.genderOption}
                                onPress={() => {
                                    setFormData({ ...formData, gender });
                                    setShowGenderModal(false);
                                }}
                            >
                                <Text style={[
                                    styles.genderOptionText,
                                    formData.gender === gender && styles.selectedGender
                                ]}>
                                    {gender}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowGenderModal(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME_COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        top: 33
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: THEME_COLORS.text,
        letterSpacing: -0.5,
    },
    saveButton: {
        backgroundColor: THEME_COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: -0.3,
    },
    formContainer: {
        flex: 1,
        padding: 16,
    },
    imageSection: {
        alignItems: 'center',
        marginVertical: 20,
    },
    imageWrapper: {
        position: 'relative',
        width: 100,
        height: 100,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: THEME_COLORS.inputBg,
    },
    editImageButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: THEME_COLORS.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: THEME_COLORS.background,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: THEME_COLORS.text,
        marginTop: 24,
        marginBottom: 16,
        paddingHorizontal: 4,
        letterSpacing: -0.3,
    },
    formSection: {
        backgroundColor: THEME_COLORS.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: THEME_COLORS.textSecondary,
        marginBottom: 8,
        fontWeight: '500',
        letterSpacing: -0.2,
    },
    input: {
        fontSize: 16,
        color: THEME_COLORS.text,
        padding: 12,
        backgroundColor: THEME_COLORS.inputBg,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: THEME_COLORS.border,
    },
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    charCount: {
        fontSize: 13,
        color: '#999',
        marginTop: 4,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: THEME_COLORS.inputBg,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: THEME_COLORS.border,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    optionText: {
        fontSize: 15,
        color: THEME_COLORS.text,
        fontWeight: '500',
        letterSpacing: -0.3,
    },
    optionValue: {
        fontSize: 15,
        color: THEME_COLORS.textSecondary,
        letterSpacing: -0.3,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        backgroundColor: THEME_COLORS.background,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: THEME_COLORS.text,
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: -0.4,
    },
    genderOption: {
        padding: 16,
        marginVertical: 4,
        backgroundColor: THEME_COLORS.inputBg,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: THEME_COLORS.border,
    },
    genderOptionText: {
        fontSize: 15,
        color: THEME_COLORS.text,
        textAlign: 'center',
        letterSpacing: -0.3,
    },
    selectedGender: {
        color: THEME_COLORS.primary,
        fontWeight: '600',
    },
    cancelButton: {
        marginTop: 16,
        paddingVertical: 16,
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    datePickerContainer: {
        backgroundColor: THEME_COLORS.inputBg,
        borderRadius: 8,
        padding: 16,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: THEME_COLORS.border,
    },
    dateArrow: {
        padding: 10,
    },
    dateDisplay: {
        flex: 1,
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        color: THEME_COLORS.text,
        fontWeight: '500',
        letterSpacing: -0.3,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 12,
    },
    modalButton: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: THEME_COLORS.inputBg,
        borderWidth: 1,
        borderColor: THEME_COLORS.border,
    },
    modalButtonConfirm: {
        backgroundColor: THEME_COLORS.primary,
        borderColor: THEME_COLORS.primary,
    },
    modalButtonTextCancel: {
        color: THEME_COLORS.text,
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: -0.3,
    },
    modalButtonTextConfirm: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: -0.3,
    },
});

export default EditProfile;
