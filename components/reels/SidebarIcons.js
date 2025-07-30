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

// const styles = StyleSheet.create({
//   sideBar: {
//     position: 'absolute',
//     right: 15,
//     bottom: 100,
//     alignItems: 'center',
//     gap: 10,
//   },
//   iconButton: {
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   iconText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '400',
//     marginTop: 4,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
// });

export default SidebarIcons;
