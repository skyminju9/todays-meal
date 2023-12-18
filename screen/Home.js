import React from 'react';
import {View, Image, StyleSheet, Text, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';


function Home(){
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          Today's{'\n'}
          Meal{'\n'}
          is...{'\n'}
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source = {require('../image/logo.png')} style={styles.image}/>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style = {styles.button} onPress={()=>navigation.navigate('LoginPage')}>
          <Text style={styles.text}>로그인</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1 ,
    flexDirection:'column',
    //alignItems: 'flex-start',
    margin:0,
    backgroundColor: '#ffffff',
  },
  imageContainer:{
    flex:0.5,
    alignItems:'center',
    justifyContent:'center',
  },
  titleContainer:{
    //flex:1,
    marginRight:20,
  },
  title: {
    fontSize: 50,
    fontWeight:'900',
    textAlign:'left',
    color:'black',
    paddingLeft:20,
    paddingTop:5,
  },
  image:{
    width:200,
    height:200,
    resizeMode:'cover',
  },
  buttonContainer:{
    position:'absolute',
    bottom:60,
    //left:0,
    alignSelf:'center',
    width:300,
    color:'black',
  },
  button:{
    position:'absolute',
    bottom:30,
    alignSelf:'center',
    paddingVertical:15,
    paddingHorizontal:100,
    borderRadius:10,
    backgroundColor:'#EDF6FF',
  },
  text:{
    fontSize:17,
    lineHeight:21,
    fontWeight:'bold',
    letterSpacing:1,
    color:'black',
  },
});

export default Home;