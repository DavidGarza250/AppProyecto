import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import { Icon } from 'react-native-elements'; // Importamos los íconos

export default function App() {
  const [meals, setMeals] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [favorites, setFavorites] = useState([]); 

  // iniciar api
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='); 
        const data = await response.json();
        setMeals(data.meals);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  // Toggle favoritos
  const toggleFavorite = (mealId) => {
    if (favorites.includes(mealId)) {
      setFavorites(favorites.filter((id) => id !== mealId));
    } else {
      setFavorites([...favorites, mealId]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetas</Text>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <View style={styles.mealContainer}>
              <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
              
              {/* Ícono de corazón */}
              <Icon
                name={favorites.includes(item.idMeal) ? 'heart' : 'heart-o'}
                type='font-awesome'
                color={favorites.includes(item.idMeal) ? 'red' : 'gray'}
                containerStyle={styles.favoriteIcon}
                onPress={() => toggleFavorite(item.idMeal)} 
              />
              
              <Text style={styles.mealName}>{item.strMeal}</Text>
              <Text style={styles.mealDetails}>{item.strCategory} - {item.strArea}</Text>
            </View>
          )}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  mealContainer: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  mealImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  favoriteIcon: {
    position: 'absolute', 
    top: 10,
    right: 10, 
    zIndex: 1, 
  },
  mealDetails: {
    marginTop: 5,
    fontSize: 14,
    color: '#777',
  },
});
