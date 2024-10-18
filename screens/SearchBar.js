import React, { useState } from 'react';
import { TextInput, View } from 'react-native';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (text) => {
        setQuery(text);
        onSearch(text);
    };

    return (
        <View>
            <TextInput
                placeholder="Search profiles..."
                value={query}
                onChangeText={handleChange}
            />
        </View>
    );
};

export default SearchBar;
