import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Acercade = () => {
    return (
        <View style={styles.container}>
          <Image
            source={require('../../assets/hanzo.jpg')}
            style={styles.inicioImage}
          />
          <Text style={styles.name}>Hansel Pérez </Text>
          <Text style={styles.email}>2021-2216</Text>
          <Text style={styles.frase}>"El guerrero más fuerte es el que es sabio en el arte de la paz."</Text>
          
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#262626',
      },
      inicioImage: {
        width: 220,
        height: 300,
        borderRadius: 20,
        marginBottom: 20,
      },
      name: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      email: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 20,
        
      },
     frase: {
        color: 'white',
        fontSize: 16,
        textAlign: "center",
        marginTop:10,
       
      },
      iconContainer: {
        flexDirection: 'row',
        marginTop: 20,
      },
      icon: {
        fontSize: 40,
        color: 'white',
        marginHorizontal: 10,
      },
    });
    
  

export default Acercade