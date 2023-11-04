import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { Alert } from 'react-native';


const DiaryScreen = () => {
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState(null);
  const [audio, setAudio] = useState(null);
  const [recording, setRecording] = useState(false);
  const recordingObject = useRef(null);

  const navigation = useNavigation();



  const handleSelectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Se requieren permisos para acceder a la galería de imágenes.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      setFoto(result.uri);
    }
  };

  
  // Función para crear un nuevo objeto de grabación
  const createNewRecordingObject = async () => {
    recordingObject.current = new Audio.Recording();
    await recordingObject.current.prepareToRecordAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
  };
  // Función para grabar audio
  const handleRecordAudio = async () => {
    if (!recording) {
      try {
        await createNewRecordingObject();
        await recordingObject.current.startAsync();
        setRecording(true);
      } catch (error) {
        console.error('Error al comenzar la grabación de audio:', error);
      }
    } else {
      try {
        await recordingObject.current.stopAndUnloadAsync();
        const uri = recordingObject.current.getURI();
        setAudio(uri);
        setRecording(false);
      } catch (error) {
        console.error('Error al detener la grabación de audio:', error);
      }
    }
  };

  // Función para borrar el audio grabado
  const handleBorrarAudio = () => {
    if (recordingObject.current) {
      recordingObject.current.stopAndUnloadAsync();
      recordingObject.current = null;
    }
    setAudio(null);
    setRecording(false);
  };

  // Función para reproducir el audio seleccionado
  const playAudio = async () => {
    if (audio) {
      const { sound } = await Audio.Sound.createAsync({ uri: audio });
      await sound.playAsync();
    }
  };

  const saveVivencia = async (nuevaVivencia) => {
    try {
      const vivencias = await AsyncStorage.getItem('vivencias');
      const vivenciasArray = JSON.parse(vivencias) || [];

      vivenciasArray.push(nuevaVivencia);

      await AsyncStorage.setItem('vivencias', JSON.stringify(vivenciasArray));
    } catch (error) {
      console.error('Error al guardar la vivencia:', error);
    }
  };

  const handleGuardarVivencia = async () => {
    if (titulo && fecha && descripcion && foto && audio) {
      const nuevaVivencia = { titulo, fecha, descripcion, foto, audio };

      await saveVivencia(nuevaVivencia);

      setTitulo('');
      setFecha('');
      setDescripcion('');
      setFoto(null);
      setAudio(null);

      navigation.navigate('Info');
    } else {
      alert('Por favor, complete todos los campos antes de guardar la vivencia.');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Lista de Vivencias:</Text>
        <Text style={styles.label}>Título:</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ingrese el título"
          placeholderTextColor="white"
        />
  
        <Text style={styles.label}>Fecha:</Text>
        <TextInput
          style={styles.input}
          value={fecha}
          onChangeText={setFecha}
          placeholder="Ingrese la fecha"
          placeholderTextColor="white"
        />
  
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Ingrese una descripción"
          placeholderTextColor="white"
          multiline
        />
  
        <Text style={styles.label}>Foto:</Text>
        <Button title="Seleccionar Imagen" onPress={handleSelectImage} />
        {foto && <Image source={{ uri: foto }} style={styles.image} />}
  
        <Text style={styles.label}>Audio:</Text>
        <Button
          
          title={recording ? 'Detener Grabación' : 'Iniciar Grabación'}
          onPress={handleRecordAudio}
          color="#4CAF50"
        />
        {audio && (
          <View style={styles.buttonContainer}>
            <Button title="Reproducir Audio" onPress={playAudio} />
            <Button
              title="Borrar Audio"
              onPress={() => {
                Alert.alert(
                  'Borrar Audio',
                  '¿Estás seguro de que deseas borrar el audio?',
                  [
                    {
                      text: 'Cancelar',
                      style: 'cancel',
                    },
                    {
                      text: 'Borrar',
                      onPress: handleBorrarAudio,
                      style: 'destructive',
                    },
                  ]
                );
              }}
              color="red"
              
            />
          </View>
        )}
  
        <Button title="Guardar Vivencia" onPress={handleGuardarVivencia} />
      </View>
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#252525', 
  },
  title:{
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',

    justifyContent: 'center',
    
    margin: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: 'white', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    color: 'white', 
    backgroundColor: '#333333', 
  },
  textArea: {
    height: 100,
    
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
  },
});

export default DiaryScreen;
