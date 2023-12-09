import React from 'react';
import Home from './screen/Home';
import LoginPage from './screen/LoginPage';
import SignUpPage from './screen/SignUpPage';
import Analyse from './screen/Analyse';
import Settings from './screen/Settings';
import Recipe from './screen/Recipe';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Image, Text, View, Pressable, SafeAreaView } from 'react-native';

const App = () => {
  const Stack = createStackNavigator();

  return (
    <SafeAreaView style={{flex:1, padding:0,}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Home'
          screenOptions={{
            headerShown:false,      
          }}>
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="LoginPage" component={LoginPage}/>
          <Stack.Screen name = "SignUpPage" component={SignUpPage} />
          <Stack.Screen name = "Analyse" component={Analyse}/>
          <Stack.Screen name = "Settings" component={Settings}/>
          <Stack.Screen name = "Recipe" component={Recipe}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;