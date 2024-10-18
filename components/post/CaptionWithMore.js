import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CaptionWithMore = ({ description }) => {
  const [showFullText, setShowFullText] = useState(false);

  const handleToggleText = () => {
    setShowFullText(!showFullText);
  };

  // بررسی وجود description و طول آن
  const displayText = showFullText 
    ? description 
    : description && description.length > 31 
      ? `${description.slice(0, 31)}...` 
      : description;

  return (
    <View>
      <Text style={styles.caption}>                  {displayText}</Text>
      {description && description.length > 31 && (
        <TouchableOpacity onPress={handleToggleText}>
          <Text style={styles.moreText}>{showFullText ? 'Less' : 'More'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  caption: {
    padding: 5,
    fontSize: 14,
    width: 380,
    left: -70,
  },
  moreText: {
    color: 'gray',
    bottom: 25,
    left: 225
  },
});

export default CaptionWithMore;
