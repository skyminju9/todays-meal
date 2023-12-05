import React from "react";
import {View, Image, StyleSheet, Text, Pressable, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { useState } from "react";

function SignUpPage(){

    const navigation = useNavigation();

    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [checkPw, setCheckPw] = useState("");

    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>회원가입</Text>
            </View>
            <View style = {styles.nameContainer}>
                <TextInput style = {styles.name}
                value={name}
                onChangeText={(text)=>setName(text)}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="이름"/>
            </View>
            <View style = {styles.idContainer}>
                <TextInput style = {styles.id}
                value={id}
                onChangeText={(text)=>setId(text)}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="아이디"/>
            </View>
            <View style = {styles.pwContainer}>
                <TextInput style = {styles.pw}
                value={pw}
                onChangeText={(text)=>setPw(text)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
                textContentType="password"
                placeholder="비밀번호"/>
            </View>
            <View style = {styles.checkPwContainer}>
                <TextInput style = {styles.checkPw}
                value={checkPw}
                onChangeText={(text)=>setCheckPw(text)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
                textContentType="password"
                placeholder="비밀번호 확인"/>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable style = {styles.button} onPress={()=>navigation.navigate('Analyse')}>
                    <Text style={styles.buttonText}>회원가입</Text>
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
        top:150,
        alignSelf:'center',

    },
    title:{
        color:'black',
        fontSize:30,
        fontWeight:'900',

    },
    nameContainer:{

    },
    name:{

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
    idContainer:{

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
    checkPwContainer:{

    },
    checkPw:{

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
        width:270,
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
});

export default SignUpPage;