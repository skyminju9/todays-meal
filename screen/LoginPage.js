import React from "react";
import {View, Image, StyleSheet, Text, Pressable, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";

function LoginPage(){
    const navigation = useNavigation();
    
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [loginStatus, setLoginStatus] = useState(null);


    const handleLogin = async () => {
        // Check if both username (id) and password are provided
        if (!id || !pw) {
            // Show an error message or handle it as needed
            setLoginStatus("failure");
            return;
        }
    
        try {
            const response = await fetch('http://ceprj.gachon.ac.kr:60022/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userid: id, password: pw }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                // Handle successful login
                setLoginStatus("success");
                // Navigate to the 'Recipe' page
                navigation.navigate('Recipe');
                // You may want to store some user information in AsyncStorage or Redux here
                // Example: AsyncStorage.setItem('token', data.token);
            } else {
                // Handle login failure
                setLoginStatus("failure");
            }
        } catch (error) {
            console.error(error);
            setLoginStatus("error");
        }
    };
    

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
            <View style = {styles.pwContainer}>
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
                <Pressable style = {styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>로그인</Text>
                </Pressable>
            </View>
            <View style={styles.singUpCotainer}>
                <Pressable style = {styles.signUp} onPress={()=>navigation.navigate('SignUpPage')}>
                    <Text style = {styles.signUpText}>회원가입</Text>
                </Pressable>
            </View>
            {loginStatus === "success" && (
                <Text style={{ color: 'green', marginTop: 20 }}>로그인 성공! Recipe 페이지로 이동합니다.</Text>
            )}
            {loginStatus === "failure" && (
                <Text style={{ color: 'red', marginTop: 20 }}>로그인 실패. 다시 시도하세요.</Text>
            )}
            {loginStatus === "error" && (
                <Text style={{ color: 'red', marginTop: 20 }}>오류가 발생했습니다. 나중에 다시 시도하세요.</Text>
            )}
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