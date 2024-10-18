import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import ProfileSearchBar from './SearchBar';
import * as SecureStore from 'expo-secure-store';

const SearchUserScreen = () => {

    const [results, setResults] = useState([]);

    const fetchProfiles = async (query) => {
        if (query) {
            const token = await SecureStore.getItemAsync('userToken');

            const response = await fetch(`https://nexsocial.ir/profile/search-users/?query=${query}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data);
            } else {
                console.log('Error fetching profiles:', response.status);
                if (response.status === 401) {
                    console.log('Unauthorized! Token may be invalid or expired.');
                }
            }
        } else {
            setResults([]);
        }
    };


    return (
        <View>
            <ProfileSearchBar onSearch={fetchProfiles} />
            <FlatList
                data={results}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Text>{item.name} ({item.username_i})</Text>
                )}
            />
        </View>
    );
};

export default SearchUserScreen;
