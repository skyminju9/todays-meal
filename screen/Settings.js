import React from "react";
import {Image, Text, View, StyleSheet, Pressable} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { CheckBox } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

function Settings(){
    return(
        <View style={styles.container}>
            <View sytle={styles.imageContainer}>
                <Image source = {require('../image/logo.png')} style={styles.image}/>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    Settings
                </Text>
            </View>
            <View style={styles.userbox}>

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

        marginLeft:10,

    },
    image:{
        width:80,
        height:80,
        resizeMode:'cover',
        
    },
    titleContainer:{

        position:'absolute',
        top:100,
        alignSelf:'left',
        marginLeft:20,

    },
    title:{
        color:'black',
        fontSize:30,
        fontWeight:'700',

    },


});

export default Settings;