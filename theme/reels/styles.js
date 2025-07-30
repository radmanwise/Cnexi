import { StyleSheet, Dimensions } from 'react-native';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#008CFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    videoContainer: {
        height: WINDOW_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    video: {
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
    },
    posterImage: {
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
        resizeMode: 'cover',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileImage: {
        width: 45,
        height: 45,
        borderRadius: 50,
    },
    username: {
        color: 'white',
        fontSize: 13,
        fontFamily: 'ManropeSemiBold',
    },
    sideBar: {
        position: 'absolute',
        right: 15,
        bottom: 150,
        alignItems: 'center',
        gap: 10,
    },
    videoWrapper: {
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
        position: 'relative',
    },
    overlay: {
        position: 'absolute',
        bottom: 150,
        left: 16,
        right: 80,
        zIndex: 2,
    },
    userTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    caption: {
        color: '#fff',
        fontSize: 13,
        lineHeight: 20,
        bottom: 10,
        fontFamily: 'Manrope',
    },
    iconText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '400',
        marginTop: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    iconButton: {
        alignItems: 'center',
        marginBottom: 15,
        transform: [{ scale: 1 }],
        opacity: 1,
    },
    iconButtonPressed: {
        transform: [{ scale: 0.95 }],
        opacity: 0.8,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        height: 45,
    },
    playIconContainer: {
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        top: 390
    },
    backButton: {
        position: 'absolute',
        top: -50,
        left: 15,
        zIndex: 10,
        padding: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 20,
    },
    userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 12,
    },
    userRowTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 36,
        height: 36,
        borderRadius: 50,
        left: -12
    },
    usernameFollowRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    username: {
        fontSize: 15,
        marginRight: 25,
        color: '#fffffffd',
        fontFamily: 'ManropeSemiBold'
    },

});