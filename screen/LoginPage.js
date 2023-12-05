import React from "react";
import {View, Image, StyleSheet, Text, Pressable, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";

function LoginPage(){
    const navigation = useNavigation();
    
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    

    return (

        <View style = {styles.container}>
            <View style = {styles.titleContainer}>
                <Text style = {styles.title}>로그인</Text>
            </View>
            <View style = {styles.idContainer}>
                <TextInput
                style = {styles.id}
                value={id}
                onChangeText={(text)=>setId(text)}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="아이디"/>
            </View>
            <View Style = {styles.pwContainer}>
            <TextInput
            style = {styles.pw}
            placeholder="비밀번호"
            value={pw}
            onChangeText={(text)=>setPw(text)}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            textContentType="password"
            />
            </View>
            <View style={styles.buttonContainer}>
                <Pressable style = {styles.button}>
                    <Text style={styles.buttonText}>로그인</Text>
                </Pressable>
            </View>
            <View style={styles.singUpCotainer}>
                <Pressable style = {styles.signUp} onPress={()=>navigation.navigate('SignUpPage')}>
                    <Text style = {styles.signUpText}>회원가입</Text>
                </Pressable>
            </View>
        </View>        
    );
};

const styles = StyleSheet.create({

    container: {
        flex:1 ,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        margin:0,
        backgroundColor: '#ffffff',
    },
    titleContainer:{

        position:'absolute',
        top:200,
        alignSelf:'center',

    },
    title:{
        color:'black',
        fontSize:30,
        fontWeight:'900',

    },
    idContainer:{

        paddingBottom:20,

    },
    id:{

        height:50,
        width:250,
        margin:12,
        borderWidth:1,
        padding:10,
        borderBottomColor:'black',
        borderTopColor:'white',
        borderLeftColor:'white',
        borderRightColor:'white',

    },
    pwContainer:{

    },
    pw:{

        height:50,
        width:250,
        margin:12,
        borderWidth:1,
        padding:10,
        borderBottomColor:'black',
        borderTopColor:'white',
        borderLeftColor:'white',
        borderRightColor:'white',

    },
    buttonContainer:{
        position:'absolute',
        bottom:60,
        //left:0,
        alignSelf:'center',
        width:250,
        color:'black',
    },
    button:{
        position:'absolute',
        bottom:60,
        alignSelf:'center',
        paddingVertical:15,
        paddingHorizontal:100,
        borderRadius:10,
        backgroundColor:'#EDF6FF',
    },
    buttonText:{

        fontSize:17,
        lineHeight:21,
        fontWeight:'bold',
        letterSpacing:1,
        color:'black',

    },
    singUpCotainer:{

        position:'absolute',
        bottom:45,
        //left:0,
        alignSelf:'center',
        width:250,

    },
    signUp:{

        position:'absolute',
        bottom:45,
        alignSelf:'center',

    },
    signUpText:{

        color:'gray',
        textDecorationLine:'underline',

    },

});

export default LoginPage;