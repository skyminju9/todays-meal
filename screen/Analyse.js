import React from "react";
import {Text, View, StyleSheet, Pressable} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


function Analyse(){

    const userIcon = <Icon name="user-circle" size={40} />;
    const navigation = useNavigation();
    return(

        <View style={styles.container}>
            <Pressable style = {styles.usericonContainer} onPress={()=>navigation.navigate('Settings')}>
                {userIcon}
            </Pressable>
            <View style = {styles.titleContainer}>
                <Text style = {styles.title}>
                    레시피 추천을 위해{'\n'}
                    username님의 취향을{'\n'}
                    파악하는 중입니다...{'\n'}
                </Text>
            </View>
            
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex:1 ,
        flexDirection:'column',
        //alignItems: 'flex-start',
        margin:0,
        backgroundColor: '#ffffff',
    },
    usericonContainer:{
        marginLeft:340,
        marginTop:15,
    },
    titleContainer:{

        position:'absolute',
        top:100,
        alignSelf:'center',

    },
    title:{
        color:'black',
        fontSize:23,
        fontWeight:'bold',

    },
})

export default Analyse;