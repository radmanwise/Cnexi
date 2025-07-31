import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import styles from '../../theme/reels/styles';

const Caption = ({ description }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
      <Text style={styles.caption}>
        {expanded ? description : `${description.substring(0, 30)}...`}
      </Text>
    </TouchableOpacity>
  );
};

export default Caption;
