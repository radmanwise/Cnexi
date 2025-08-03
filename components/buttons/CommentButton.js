import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { formatDistanceToNow, parseISO } from 'date-fns';
import ipconfig from '../../config/ipconfig';
import CommentIcon from '../../components/icons/CommentIcon';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Title, Subtitle } from '../../components/ui/Typography';
import FastImage from 'expo-fast-image';
import TelegramIcon from '../../components/icons/TelegramIcon';
import LikeIcon from '../../components/icons/LikeIcon';
import DisLikeIcon from '../../components/icons/DisLikeIcon';

const CommentsButton = ({ postId, iconSize = 24, iconColor = '#000' }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isReplyModalVisible, setReplyModalVisible] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setError(null);
  };

  const truncateText = useMemo(() => (str, maxLength) =>
    str?.length > maxLength ? `${str.substring(0, maxLength)}...` : str,
    []);

  const navigation = useNavigation();

  const getToken = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        throw new Error('No token found');
      }
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      setError('Authentication error. Please login again.');
      return null;
    }
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) return;

      const response = await axios.get(`${ipconfig.BASE_URL}/post/${postId}/comments/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      setComments(response.data.results);
      setError(null);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError('Failed to load comments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [postId, getToken]);

  useEffect(() => {
    if (isModalVisible) {
      fetchComments();
    }
  }, [isModalVisible, fetchComments]);

  const renderReply = ({ item }) => (
    <View style={styles.replyContainer}>
      <View style={styles.replyLine} />
      <View style={styles.replyContent}>
        <FastImage
          source={{ uri: item.profile_image?.startsWith('http') ? item.profile_image : `${ipconfig.BASE_URL}${item.profile_image}` }}
          style={styles.replyProfileImage}
          cacheKey={`reply-profile-${item.id}`}
        />
        <View style={styles.replyTextContainer}>
          <Subtitle style={styles.replyUsername}>{item.username}</Subtitle>
          <Subtitle style={styles.replyText}>{item.text}</Subtitle>
          {item.created_at && (
            <Subtitle style={styles.replyTime}>
              {formatDistanceToNow(parseISO(item.created_at), { addSuffix: true })}
            </Subtitle>
          )}
        </View>
      </View>
    </View>
  );

  const handleReply = (commentId) => {
    setSelectedCommentId(commentId);
    setReplyModalVisible(true);
  };

  const handleSubmitReply = async () => {
    if (!replyText || !selectedCommentId) return;

    try {
      await addReply(replyText, selectedCommentId);
      setReplyText('');
      setReplyModalVisible(false);
      fetchComments();
    } catch (error) {
      setError('Failed to post reply. Please try again.');
    }
  };

  const addComment = async (commentText, postId) => {
    if (!commentText.trim()) return;

    try {
      const token = await getToken();
      if (!token) return;

      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) throw new Error('Invalid token format');

      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.user_id;
      if (!userId) throw new Error('User ID not found in token');

      await axios.post(
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

      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      setError('Failed to post comment. Please try again.');
    }
  };

  const addReply = async (replyText, commentId) => {
    try {
      const token = await getToken();
      if (!token) return;

      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) throw new Error('Invalid token format');

      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.user_id;
      if (!userId) throw new Error('User ID not found in token');

      await axios.post(
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
    } catch (error) {
      console.error("Error adding reply:", error);
      throw error;
    }
  };

  const renderComment = ({ item }) => {
    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentHeader}>
          <View style={styles.userInfo}>
            <TouchableOpacity
              style={styles.profileContainer}
              onPress={() => navigation.navigate('OtherUserProfile', { slug: item.username })}
            >
              <FastImage
                source={{ uri: item.profile_image?.startsWith('http') ? item.profile_image : `${ipconfig.BASE_URL}${item.profile_image}` }}
                style={styles.profileImage}
                cacheKey={`comment-profile-${item.id}`}
              />
              <Subtitle style={styles.username}>
                {truncateText(item.username || 'username', 12)}
              </Subtitle>
              {item.created_at && (
                <Subtitle style={styles.time}>
                  {formatDistanceToNow(parseISO(item.created_at), { addSuffix: true })}
                </Subtitle>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons name="dots-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.commentBody}>
          {item.text && <Subtitle style={styles.commentText}>{item.text}</Subtitle>}
          {item.file && (
            <FastImage
              source={{ uri: item.file.startsWith('http') ? item.file : `${ipconfig.BASE_URL}${item.file}` }}
              style={styles.filePost}
              resizeMode="contain"
              cacheKey={`comment-file-${item.id}`}
            />
          )}
        </View>

        <View style={styles.commentFooter}>
          <View style={styles.footerLeft}>
            <LikeIcon name="thumb-up" size={20} color="black" />
            <DisLikeIcon name="thumb-down" size={20} color="black" />
            <TouchableOpacity onPress={() => handleReply(item.id)}>
              <Subtitle style={styles.replyButton}>Reply</Subtitle>
            </TouchableOpacity>
          </View>
        </View>

        {item.replies && item.replies.length > 0 && (
          <FlatList
            data={item.replies}
            renderItem={renderReply}
            keyExtractor={reply => reply.id.toString()}
            scrollEnabled={false}
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
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        onSwipeComplete={toggleModal}
        swipeDirection={['down']}
        style={styles.modal}
        backdropOpacity={0.5}
        statusBarTranslucent={true}
        avoidKeyboard={true}
        propagateSwipe={true}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.modalContentWrapper}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Title style={styles.commentCount}>
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </Title>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Subtitle style={styles.errorText}>{error}</Subtitle>
                <TouchableOpacity onPress={fetchComments}>
                  <Subtitle style={styles.retryText}>Retry</Subtitle>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Subtitle style={styles.emptyText}>No comments yet</Subtitle>
                    <Subtitle style={styles.emptySubText}>Be the first to comment</Subtitle>
                  </View>
                )}
                contentContainerStyle={[
                  styles.commentsListContent,
                  comments.length === 0 && { flex: 1 }
                ]}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={10}
                keyboardShouldPersistTaps="handled"
              />
            )}

            <View style={styles.inputContainer}>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Write a comment..."
                placeholderTextColor="#999"
                style={styles.input}
                multiline
                returnKeyType="send"
                onSubmitEditing={() => addComment(newComment, postId)}
              />
              {newComment.length > 0 && (
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={() => addComment(newComment, postId)}
                  disabled={isLoading}
                >
                  <TelegramIcon name="send" size={20} color="#ffff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={isReplyModalVisible}
        onBackdropPress={() => setReplyModalVisible(false)}
        onBackButtonPress={() => setReplyModalVisible(false)}
        style={styles.replyModal}
        backdropOpacity={0.5}
      >
        <View style={styles.replyModalContent}>
          <View style={styles.modalHandle} />
          <TextInput
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Write a reply..."
            placeholderTextColor="#999"
            style={styles.replyInput}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSubmitReply}
          />
          <TouchableOpacity
            style={[
              styles.sendReplyButton,
              !replyText && styles.sendButtonDisabled
            ]}
            onPress={handleSubmitReply}
            disabled={!replyText || isLoading}
          >
            <TelegramIcon name="send" size={20} color="#ffff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentButton: {
    padding: 8,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  replyModal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
 modalContentWrapper: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '80%',
    width: '100%', 
  },
  
  modalContent: {
    flex: 1, 
    paddingTop: 8,
  },

  modalHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  commentCount: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  commentsListContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  commentContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
    color: '#1a1a1a',
  },
  time: {
    color: '#666',
    fontSize: 12,
    marginLeft: 8,
  },
  commentBody: {
    marginVertical: 8,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  filePost: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  replyButton: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '500',
  },
  replyContainer: {
    marginLeft: 16,
    marginTop: 16,
  },
  replyLine: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  replyContent: {
    flexDirection: 'row',
    paddingLeft: 32,
  },
  replyProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  replyTextContainer: {
    flex: 1,
  },
  replyUsername: {
    fontWeight: '600',
    fontSize: 13,
    color: '#1a1a1a',
  },
  replyText: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
    lineHeight: 18,
  },
  replyTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    paddingRight: 48,
  },
  replyInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    paddingRight: 48,
    marginBottom: 16,
  },
  sendButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendReplyButton: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CommentsButton;