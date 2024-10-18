// RefreshableComponent.js
import React, { useState, useCallback } from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';

const RefreshableComponent = ({ children, onRefreshAction }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // اجرای اکشن رفرش که از بیرون کامپوننت دریافت شده
    onRefreshAction().finally(() => {
      setRefreshing(false);
    });
  }, [onRefreshAction]);

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        {children}
      </View>
    </ScrollView>
  );
};

export default RefreshableComponent;
