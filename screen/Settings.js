import React from "react";
import {Image, Text, View, StyleSheet, Pressable} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { CheckBox } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";

function Settings() {
    const navigation = useNavigation();
    const [loggedIn, setLoggedIn] = useState(true); // 예시로 loggedIn 상태를 사용
  
    const handleLogout = async () => {
      try {
        // 서버에 로그아웃 요청 보내기
        const response = await fetch('http://ceprj.gachon.ac.kr:60022/logout', {
          method: 'POST',
        });
  
        const data = await response.json();
  
        if (data.success) {
          // 세션 정보 클리어
          clearSession();
          // 로그인 상태 업데이트
          setLoggedIn(false);
          // 로그인 페이지로 이동
          navigation.navigate('Login');
        } else {
          console.error('로그아웃 실패');
          // 실패 시에 대한 처리
        }
      } catch (error) {
        console.error(error);
        // 오류 발생 시에 대한 처리
      }
    };
  
    // 세션 정보 클리어 함수
    const clearSession = () => {
      // 여기서 다른 클리어 로직을 추가하거나 필요한 경우 처리
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={require('../image/logo.png')} style={styles.image} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Settings
          </Text>
        </View>
        <View style={styles.logoutContainer}>
          <Pressable style={styles.logoutbutton} onPress={handleLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </Pressable>
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