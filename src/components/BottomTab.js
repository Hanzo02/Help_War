
import { StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Feather, MaterialCommunityIcons, AntDesign} from '@expo/vector-icons'; 
import Acercade from '../screens/Acercade';
import DiaryScreen from '../screens/DiaryScreen';
import Info from '../screens/Info';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator style={styles.container}>
        <Tab.Screen 
         name='Agregar Viviendas' 
         component={DiaryScreen}
         options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="sword-cross" color={color} size={size} /> 
            ),
          }}/>
        <Tab.Screen
         name="Info" 
         component={Info}
         options={{
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="switcher" color={color} size={size} /> 
            ),
          }}
         />
        <Tab.Screen
         name="Acerca De" 
         component={Acercade}
         options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="file-text" color={color} size={size} /> 
            ),
          }}
         />
    
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
   
    backgroundColor: 'black',
    color: 'black',
  
  },
});

export default BottomTab