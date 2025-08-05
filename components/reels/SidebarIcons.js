import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import LikeButton from '../buttons/LikeButton';
import CommentButton from '../buttons/CommentButton';
import ShareButton from '../buttons/ShareButton';
import SaveButton from '../buttons/SaveButton';
import { Subtitle } from '../ui/Typography';
import styles from '../../theme/reels/styles';

const SidebarIcons = ({ item, likes, onLike }) => {
  return (
    <View style={styles.sideBar}>
      <TouchableOpacity style={styles.iconButton} onPress={() => onLike(item.id)}>
        <LikeButton postId={item.id} initialLiked={likes[item.id] > 0} iconColor="white" iconSize={28} />
        <Subtitle style={styles.iconText}>{likes[item.id] || "likes"}</Subtitle>
      </TouchableOpacity>

      <View style={styles.iconButton}>
        <CommentButton postId={item.id} iconColor="white" iconSize={28} />
        <Subtitle style={styles.iconText}>{item.comments || "comments"}</Subtitle>
      </View>

      <View style={styles.iconButton}>
        <SaveButton postId={item.id} iconColor="white" iconSize={25} />
        <Subtitle style={styles.iconText}>{item.saved || "saved"}</Subtitle>
      </View>

      <View style={styles.iconButton}>
        <ShareButton postId={item.id} iconColor="white" iconSize={25} />
        <Subtitle style={styles.iconText}>{item.shares || "shares"}</Subtitle>
      </View>
    </View>
  );
};

export default SidebarIcons;
