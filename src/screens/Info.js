import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const Info = () => {
  const [vivencias, setVivencias] = useState([]);

  const loadVivencias = async () => {
    try {
      const vivenciasJSON = await AsyncStorage.getItem('vivencias');
      if (vivenciasJSON) {
        const vivenciasData = JSON.parse(vivenciasJSON);
        setVivencias(vivenciasData);
      }
    } catch (error) {
      console.error('Error al cargar las vivencias:', error);
    }
  };

  useEffect(() => {
    loadVivencias();
  }, []);

  const handleReproducirAudio = async (audioUri) => {
    const soundObject = new Audio.Sound();

    try {
      await soundObject.loadAsync({ uri: audioUri });
      await soundObject.playAsync();
    } catch (error) {
      console.error('Error al reproducir el audio:', error);
    }
  };

  const handleBorrarTodo = async () => {
    Alert.alert(
      'Borrar Todo',
      '¿Estás seguro de que deseas borrar todas las vivencias?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('vivencias');
              setVivencias([]);
              Alert.alert('Borrar Todo', 'Todas las vivencias han sido eliminadas.');
            } catch (error) {
              console.error('Error al borrar todas las vivencias:', error);
            }
          },
        },
      ]
    );
  };

  const handleActualizarVivencias = () => {
    loadVivencias();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Lista de Vivencias:</Text>
      <View style={styles.buttonContainer}>
        <Button title="Actualizar Vivencias" onPress={handleActualizarVivencias} />
        <Button
          title="Borrar Todo"
          onPress={handleBorrarTodo}
          color="red"
        />
      </View>
      <FlatList
        data={vivencias}
        keyExtractor={(vivencia, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.vivenciaItem}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.fecha}>{item.fecha}</Text>
            <Text style={styles.descripcion}>{item.descripcion}</Text>
            {item.foto && <Image source={{ uri: item.foto }} style={styles.imagen} />}
            {item.audio && (
              <Button title="Reproducir Audio" onPress={() => handleReproducirAudio(item.audio)} />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  vivenciaItem: {
    backgroundColor: '#333333',
    marginTop: 15,
    marginBottom: 16,
    padding: 35,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  fecha: {
    fontSize: 16,
    marginBottom: 8,
    color: 'lightgray',
  },
  descripcion: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
  },
  imagen: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',

    marginRight: 10,
  },
});

export default Info;
