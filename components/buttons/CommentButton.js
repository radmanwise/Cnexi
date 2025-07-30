import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDistanceToNow } from 'date-fns';
import ipconfig from '../../config/ipconfig';
import CommentIcon from '../../components/icons/CommentIcon';
import { useFonts } from 'expo-font';
import TelegramIcon from '../../components/icons/TelegramIcon';

const CommentsButton = ({ postId, iconSize = 28, iconColor = '#000' }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isReplyModalVisible, setReplyModalVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isScrollingToTop, setIsScrollingToTop] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        console.error('No token found');
        return null;
      }
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  const fetchComments = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await axios.get(`${ipconfig.BASE_URL}/post/${postId}/comments/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      setComments(response.data.results);

    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("Network Error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      fetchComments();
    }
  }, [isModalVisible]);

  const renderReply = ({ item }) => (
    <View style={styles.replyContainer}>
      <View style={styles.replyLine} />
      <View style={styles.replyContent}>
        <Image
          source={{ uri: `${ipconfig.BASE_URL}/${item.profile_image}` }}
          style={styles.replyProfileImage}
        />
        <View style={styles.replyTextContainer}>
          <Text style={styles.replyUsername}>{item.username}</Text>
          <Text style={styles.replyText}>{item.text}</Text>
        </View>
      </View>
    </View>
  );

  const handleReply = (commentId) => {
    setSelectedCommentId(commentId);
    setReplyModalVisible(true);
  };

  const handleSubmitReply = () => {
    if (replyText && selectedCommentId) {
      addReply(replyText, selectedCommentId);
      setReplyText('');
      setReplyModalVisible(false);
    }
  };

  const addComment = async (commentText, postId) => {
    try {
      const token = await getToken();
      console.log("Token:", token);

      if (token) {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const userId = payload.user_id;
          
          if (userId) {
            const response = await axios.post(
              `${ipconfig.BASE_URL}/post/${postId}/comments/create/`,
              {
                text: commentText,
                post: postId,
                user: userId,
              },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (response.status === 201) {
              setNewComment('');
              fetchComments();
            }
            return response.data;
          }
        }
      }

      throw new Error('Could not get user ID from token');
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.status, error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };
  

  const addReply = async (replyText, commentId) => {
    try {
      const token = await getToken();
      console.log("Token for reply:", token);

      if (token) {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const userId = payload.user_id;
          
          if (userId) {
            const response = await axios.post(
              `${ipconfig.BASE_URL}/post/comments/${commentId}/reply/`,
              {
                text: replyText,
                user: userId,
                comment: commentId,
                post_id: postId
              },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (response.status === 201) {
              fetchComments();
            }
            return response.data;
          }
        }
      }

      throw new Error('Could not get user ID from token');
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.status, error.response.data);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  const renderComment = ({ item }) => {
    const timeAgo = formatDistanceToNow(new Date(item.created_at), { addSuffix: true });

    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentHeader}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: `${item.profile_image}` }}
              style={styles.profileImage}
            />
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.time}>{timeAgo}</Text>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons name="dots-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.commentBody}>
          {item.text && <Text style={styles.commentText}>{item.text}</Text>}
          {item.file && (
            <Image
              source={{ uri: `${ipconfig.BASE_URL}/${item.file}` }}
              style={styles.filePost}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.commentFooter}>
          <View style={styles.footerLeft}>
            <Text style={styles.likes}>{item.likes} likes</Text>
            <TouchableOpacity onPress={() => handleReply(item.id)}>
              <Text style={styles.replyButton}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {item.replies && item.replies.length > 0 && (
          <FlatList
            data={item.replies}
            renderItem={renderReply}
            keyExtractor={reply => reply.id.toString()}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.commentButton} onPress={toggleModal}>
        <CommentIcon size={iconSize} color={iconColor} />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={(e) => {
          e.stopPropagation();
          toggleModal();
        }}
        onBackButtonPress={toggleModal}
        onSwipeComplete={toggleModal}
        style={styles.modal}
        backdropOpacity={0.5}
        statusBarTranslucent={true}
        coverScreen={true}
        propagateSwipe={false}
        avoidKeyboard={true}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalContentWrapper}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.commentCount}>
                {comments.length} comments
              </Text>
            </View>

            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={item => item.id.toString()}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No comments yet</Text>
                  <Text style={styles.emptySubText}>Be the first to comment</Text>
                </View>
              )}
              showsVerticalScrollIndicator={true}
              style={styles.commentsList}
              contentContainerStyle={[
                styles.commentsListContent,
                comments.length === 0 && { flex: 1 }
              ]}
              bounces={true}
              onEndReachedThreshold={0.1}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
            />


            <View style={styles.inputContainer}>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Write a comment..."
                style={styles.input}
                selectionColor="gray"
                onTouchStart={(e) => e.stopPropagation()}
              />
              {newComment.length > 0 && (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => addComment(newComment, postId)}
                >
                  <TelegramIcon name="send" size={20} color="#ffff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        isVisible={isReplyModalVisible}
        onBackdropPress={() => setReplyModalVisible(false)}
        onBackButtonPress={() => setReplyModalVisible(false)}
        style={styles.modal}
        backdropOpacity={0.5}
      >
        <View style={styles.replyModalContent}>
          <View style={styles.modalHandle} />
          <TextInput
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Write a reply..."
            style={styles.replyInput}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendReplyButton,
              !replyText && styles.sendButtonDisabled
            ]}
            onPress={handleSubmitReply}
            disabled={!replyText}
          >
            <TelegramIcon name="send" size={20} color="#ffff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  commentContainer: {
    marginBottom: 12,
    padding: 10,
  },

  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },

  username: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 13,
    color: '#1a1a1a',
  },

  time: {
    color: '#8e8e8e',
    fontSize: 13,
    fontFamily: 'Inter',
    marginLeft: 6,
  },

  commentBody: {
    marginVertical: 10,
  },
  commentText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#2c2c2c',
  },
  filePost: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 10,
  },

  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: -10,
  },

  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  likes: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Inter',
    fontWeight: '500',
  },

  replyButton: {
    color: 'gray',
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: '600',
  },

  replyContainer: {
    marginLeft: 5,
    marginTop: 10,
  },

  replyLine: {
    position: 'absolute',
    left: 20,
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: '#f0f0f0',
  },
  replyContent: {
    flexDirection: 'row',
    paddingLeft: 38,
    marginTop: 8,
  },
  replyProfileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#f0f0f0',
  },
  replyTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  replyUsername: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    color: '#1a1a1a',
  },

  replyText: {
    fontSize: 13,
    color: '#2c2c2c',
    marginTop: 3,
    lineHeight: 20,
  },

  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 24,
    padding: 14,
    paddingRight: 45, 
    fontSize: 14,
    fontFamily: 'Inter',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sendReplyButton: {
    position: 'absolute',
    right: 25,
    bottom: 30,
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  modalContentWrapper: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '95%',
  },
  modalContent: {
    flex: 1,
    paddingTop: 8,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  commentsList: {
    flex: 1,
  },
  commentsListContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },

  commentsListContent: {
    paddingHorizontal: 15,
  },

  inputContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: 'white',
  },

  commentCount: {
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 13,
    marginTop: 5,
    marginBottom: 10,
  },

  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },

  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  sendButton: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontWeight: '800',
  },
  emptySubText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#999',
  }, 
  commentButton: {
    padding: 14,
  },
  replyModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  replyInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 24,
    padding: 14,
    paddingRight: 45,
    fontSize: 14,
    fontFamily: 'Inter',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    maxHeight: 100,
  },

  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default CommentsButton;