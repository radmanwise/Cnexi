import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDistanceToNow } from 'date-fns';


const ReelCommentButton = ({ postId }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Fetch comments from the API
  const fetchComments = async () => {
    try {
      const response = await fetch(`https://nexsocial.ir/post/${postId}/comments/`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Fetch token from SecureStore
  const fetchToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      console.log('token: ', token);
      return token; // Return the token for use
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null; // Return null if there's an error
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      fetchComments();
    }
  }, [isModalVisible]);


  const renderReply = ({ item }) => (
    <View style={styles.replyContainer}>
      <Text style={styles.username}>{item.username}</Text>
      <Text>{item.text}</Text>
    </View>
  );

  const handleReply = (commentId) => {
    const replyText = prompt("Enter your reply:"); 
    if (replyText && commentId) {
      addReply(replyText, commentId);
    }
  };

  const addComment = async (commentText, postId) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const user = await AsyncStorage.getItem('@user');
      const userId = user ? JSON.parse(user).id : null;

      if (!token || !userId) {
        throw new Error('No authentication token or user found.');
      }

      const response = await axios.post(`https://nexsocial.ir/post/${postId}/comments/add/`,
        {
          text: commentText,
          post: postId,
          user: userId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Comment added:', response.data);

      if (response.status === 201) {
        setNewComment('');
        fetchComments();
      } else {
        console.error('Failed to add comment:', response.data);
      }

      return response.data;

    } catch (error) {
      console.error('Error adding comment:', error.response?.data || error.message);
    }
  };

  const addReply = async (replyText, commentId) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const user = await AsyncStorage.getItem('@user');
      const userId = user ? JSON.parse(user).id : null;

      if (!token || !userId) {
        throw new Error('No authentication token or user found.');
      }
      const response = await axios.post(`https://nexsocial.ir/comment/${commentId}/reply/`,
        {
          text: replyText,
          comment: commentId,
          user: userId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Reply added:', response.data);

      fetchComments();

    } catch (error) {
      console.error('Error adding reply:', error.response?.data || error.message);
    }
  };

  const renderComment = ({ item }) => {
    const timeAgo = formatDistanceToNow(new Date(item.created_at), { addSuffix: true });

    return (
      <View style={styles.commentContainer}>
        <Image source={{ uri: `https://nexsocial.ir/${item.profile_image}` }} style={styles.profileImage} />
        <View style={styles.commentHeader}>
          <Text style={styles.username}>{item.username}</Text>

          {item.file && item.file.endsWith('.gif') ? (
            <Image
              source={{ uri: `https://nexsocial.ir/${item.file}` }}
              style={styles.filePost}
              resizeMode="contain"
            />
          ) : item.file ? (
            <Image
              source={{ uri: `https://nexsocial.ir/${item.file}` }}
              style={styles.filePost}
              resizeMode="contain"
            />
          ) : null}

          <Text style={styles.time}>{timeAgo}</Text>

        </View>
        {item.text ? <Text>{item.text}</Text> : null}
        <View style={styles.commentFooter}>
          <Text style={styles.likes}>{item.likes} likes</Text>
          <TouchableOpacity onPress={() => handleReply(item.id)}>
            <Text style={styles.replyButton}>Reply</Text>
          </TouchableOpacity>

          {item.replies && item.replies.length > 0 && (
            <FlatList
              data={item.replies}
              renderItem={renderReply}  
              keyExtractor={reply => reply.id.toString()}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.likeButton} onPress={toggleModal}>
        <MaterialCommunityIcons name="message-reply-text-outline" size={29} color="white" />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        swipeDirection={['down']}
        onSwipeComplete={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={{ fontWeight: '600', top: 5, textAlign: 'center' }}>{comments.length} comments</Text>

          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={item => item.id.toString()} // Ensure id is a string
          />

          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment..."
            style={styles.input}
            selectionColor="gray"
          />
          {newComment.length > 0 && (
            <TouchableOpacity
              style={{ left: 370, position: 'absolute', bottom: 13 }}
              onPress={() => addComment(newComment, postId)}
            >
              <AntDesign name="caretcircleoup" size={29} color="blue" />
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentContainer: {
    borderBottomWidth: 1,
    borderColor: '#ffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontWeight: 'bold',
    top: -31,
    left: 35,
  },
  time: {
    color: '#888',
    top: -30,
    left: -12,
  },
  commentImage: {
    width: '100%',
    height: 150,
    marginVertical: 10,
    borderRadius: 9,
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  likes: {
    fontSize: 12,
    color: '#888',
  },
  replyButton: {
    color: '#007AFF',
    fontSize: 12,
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
    height: '95%',
  },
  modalHandle: {
    width: 50,
    height: 5,
    backgroundColor: 'gray',
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
  },
  input: {
    borderRadius: 15,
    padding: 8,
    bottom: -15,
    fontSize: 14,
    width: '93%'
  },
  commentButton: {
    gap: 10,
    flexDirection: 'row',
    marginTop: -50,
  },
  profileImage: {
    borderRadius: 50,
    width: 40,
    height: 40,
    left: -10,
  }
});

export default ReelCommentButton;
