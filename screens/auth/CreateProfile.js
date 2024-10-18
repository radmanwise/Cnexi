import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // برای دریافت توکن
import jwtDecode from 'jwt-decode'; // برای دیکد کردن توکن

const CreateProfile = ({ navigation }) => {
    const [username, setUsername] = useState('');  // برای نام کاربری از توکن
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        // دریافت نام کاربری از توکن JWT
        const getUserInfo = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    setUsername(decodedToken.username);  
                    console.log(username)
                }
            } catch (error) {
                console.log('Error getting token', error);
            }
        };

        getUserInfo();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.uri);
        }
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('bio', username);
        formData.append('name', name);

        if (image) {
            let filename = image.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let fileType = match ? `image/${match[1]}` : `image`;

            formData.append('profile_image', {
                uri: image,
                name: filename,
                type: fileType,
            });
        }

        fetch('https://nexsocial.ir/profile/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                navigation.navigate('home');
            })
            .catch(error => console.log(error));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.profileImage} />
                ) : (
                    <Image
                        style={styles.pickImage}
                        source={require('../../assets/user.jpg')}
                    />
                )}
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder='Name (Option)'
            />
            <TextInput
                style={styles.input}
                value={username}
                editable={false}  // نام کاربری را از توکن می‌گیریم و غیر قابل تغییر است
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        top: 130,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 13,
    },
    imagePicker: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden',
        left: 123
    },
    pickImage: {
        width: 100,
        height: 100
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        left: -31
    },
    button: {
        backgroundColor: '#000',
        padding: 13,
        borderRadius: 13,
    }
});

export default CreateProfile;
