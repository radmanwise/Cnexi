import React, { useState } from 'react';
import { 
    View, 
    TextInput, 
    TouchableOpacity, 
    Text, 
    StyleSheet, 
    Image, 
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchUserScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            return;
        }

        setResults([
            {
                id: '1',
                name: 'Emma Watson',
                username: '@emma',
                avatar: require('../assets/img/app/cnexi.jpg'),
                verified: true,
                followers: '28.9M'
            },
            {
                id: '2',
                name: 'Tom Holland',
                username: '@tomh',
                avatar: require('../assets/img/app/cnexi.jpg'),
                verified: true,
                followers: '19.2M'
            },
            {
                id: '3',
                name: 'Zendaya',
                username: '@zend',
                avatar: require('../assets/img/app/cnexi.jpg'),
                verified: true,
                followers: '24.5M'
            },
        ]);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.resultItem}>
            <Image
                source={item.avatar}
                style={styles.avatarImage}
            />
            <View style={styles.userInfo}>
                <View style={styles.nameContainer}>
                    <Text style={styles.userName}>{item.name}</Text>
                    {item.verified && (
                        <Ionicons name="checkmark-circle" size={16} color="#1DA1F2" style={styles.verifiedBadge} />
                    )}
                </View>
                <View style={styles.userDetails}>
                    <Text style={styles.userHandle}>{item.username}</Text>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.followers}>{item.followers} followers</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>

            <View style={styles.header}>
            </View>
            
            <View style={styles.searchBar}>
                <Ionicons 
                    name="search-outline" 
                    size={20} 
                    color="#657786" 
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Search people"
                    placeholderTextColor="#657786"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity 
                        onPress={() => setSearchQuery('')}
                        style={styles.clearButton}
                    >
                        <View style={styles.clearButtonInner}>
                            <Ionicons name="close" size={16} color="#657786" />
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={results}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 35,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#14171A',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF3F4',
        marginHorizontal: 16,
        marginVertical: 12,
        borderRadius: 25,
        height: 40,
    },
    searchIcon: {
        marginHorizontal: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#14171A',
        padding: 0,
    },
    clearButton: {
        padding: 8,
        marginRight: 4,
    },
    clearButtonInner: {
        backgroundColor: '#CED5DC',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 16,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    avatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF3F4',
    },
    userInfo: {
        flex: 1,
        marginLeft: 12,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#14171A',
        marginRight: 4,
    },
    verifiedBadge: {
        marginLeft: 2,
    },
    userDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    userHandle: {
        fontSize: 14,
        color: '#657786',
    },
    bulletPoint: {
        fontSize: 14,
        color: '#657786',
        marginHorizontal: 4,
    },
    followers: {
        fontSize: 14,
        color: '#657786',
    },
    followButton: {
        backgroundColor: '#14171A',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginLeft: 12,
    },
    followButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    }
});

export default SearchUserScreen;