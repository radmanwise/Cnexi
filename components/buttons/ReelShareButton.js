import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Octicons from '@expo/vector-icons/Octicons';

const ReelShareButton = ({ postId }) => {
    const [isModalVisible, setModalVisible] = useState(false);


    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.likeButton} onPress={toggleModal}>
                <Fontisto name="share-a" size={24} color="white" />
            </TouchableOpacity>

            <Modal
                isVisible={isModalVisible}
                swipeDirection={['down']}
                onSwipeComplete={toggleModal}
                style={styles.modal}
            >
                <View style={styles.modalContent}>
                    <Text style={{ fontWeight: '600', top: -5, textAlign: 'center' }}>share</Text>

                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.actionButton}>
                            <FontAwesome name="download" size={27} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="flag-sharp" size={27} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <FontAwesome5 name="heart-broken" size={27} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Octicons name="share-android" size={27} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '20%',
    },
    modalHandle: {
        width: 50,
        height: 5,
        backgroundColor: 'gray',
        borderRadius: 10,
        alignSelf: 'center',
        marginVertical: 10,
    },

    commentsList: {
        maxHeight: '60%', // Limit height of comments list
        marginBottom: 10,
    },
    commentContainer: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    actionsContainer: {
        flexDirection: 'row',
        marginTop: 25,
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionButton: {
        padding: 30,
        backgroundColor: '#ccc',
        borderRadius: 12,
    },
    actionText: {
        color: 'blue',
    },
});

export default ReelShareButton;
