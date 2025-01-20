
import React, { useState, useCallback } from 'react';
import { FlatList, RefreshControl, Text } from 'react-native';

const App = () => {
  interface DataItem {
    id: number;
    name: string;
  }

  const [data, setData] = useState<DataItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate fetching data with a promise
  const fetchData = async () => {
    return new Promise<DataItem[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
          { id: 3, name: 'Item 3' },
        ]);
      }, 1000); // Simulate network delay
    });
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const result = await fetchData();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
};

export default App;
