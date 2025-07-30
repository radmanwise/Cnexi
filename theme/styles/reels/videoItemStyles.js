import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoWrapper: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width,
    height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  posterImage: {
    width,
    height,
    position: 'absolute',
    resizeMode: 'cover',
  },
  loadingIndicator: {
    position: 'absolute',
    top: height / 2 - 20,
    left: width / 2 - 20,
    zIndex: 10,
  },
  progressBarBackground: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    height: 2,
    flexDirection: 'row',
  },
  progressBar: {
    backgroundColor: '#fff',
  },
  progressBarRemaining: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  playIconContainer: {
    position: 'absolute',
    top: height / 2 - 25,
    left: width / 2 - 25,
    zIndex: 15,
  },
  heartContainer: {
    position: 'absolute',
    top: height / 2 - 50,
    left: width / 2 - 50,
    zIndex: 15,
  },
  overlay: {
    position: 'absolute',
    bottom: 70,
    left: 10,
    right: 10,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRowTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: 10,
  },
  usernameFollowRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  qualitySelector: {
    flexDirection: 'row',
    marginTop: 10,
  },
  qualityOption: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
  },
  qualityOptionSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
});

export default styles;
