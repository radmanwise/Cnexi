import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import styles from '../../theme/reels/styles';
import { Subtitle } from '../ui/Typography';

const Caption = ({ description }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
      <Subtitle style={styles.caption}>
        {expanded ? description : `${description.substring(0, 30)}...`}
      </Subtitle>
    </TouchableOpacity>
  );
};

export default Caption;
