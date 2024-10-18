import React from 'react';
import { Modal, View, TouchableOpacity, Text, Image } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const ZoomableImage = ({ imageUri }) => {
  const [visible, setVisible] = React.useState(false);

  const images = [
    {
      url: imageUri,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image
          source={{ uri: imageUri }}
          style={{ width: 415, height: 250, left: -10 }} 
        />
      </TouchableOpacity>

      <Modal visible={visible} transparent={true}>
        <ImageViewer
          imageUrls={images}
          enableSwipeDown={true}
          onSwipeDown={() => setVisible(false)} 
          onCancel={() => setVisible(false)} 
        />
      </Modal>
    </View>
  );
};

export default ZoomableImage;
