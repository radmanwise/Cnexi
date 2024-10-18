import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CaptionWithMoreExplore = ({ description }) => {
  const [showFullText, setShowFullText] = useState(false);

  const handleToggleText = () => {
    setShowFullText(!showFullText);
  };

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
    fontSize: 16,
    width: 380,
    left: -86,
    color: 'white',
    top: 10,
  },
  moreText: {
    color: 'white',
    bottom: 17,
    left: 250
  },
});

export default CaptionWithMoreExplore;
