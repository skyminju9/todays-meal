import React, {useEffect} from "react";
import {Image, Text, View, StyleSheet, Pressable} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { CheckBox } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import { FadeInLeft } from "react-native-reanimated";



function Settings() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState(null);
    const userIcon = <Icon name="user-circle" size={40} />;
    const rightIcon = <Icon2 name="right" size={20} />;

    const handleLogout = async () => {
      try {
        // 서버에 로그아웃 요청 보내기
        const response = await axios.post('http://ceprj.gachon.ac.kr:60022/logout');
        const data = response.data;
  
        if (data.success) {
          // 세션 정보 클리어
          clearSession();
          setUserName(null);
          navigation.navigate('Login');
        } else {
          console.error('로그아웃 실패', data.message);
          // 실패 시에 대한 처리
        }
      } catch (error) {
        console.error('로그아웃 요청 중 오류 발생', error);
        // 오류 발생 시에 대한 처리
      }
    };
  
    // 세션 정보 클리어 함수
    const clearSession = () => {
      // 여기서 다른 클리어 로직을 추가하거나 필요한 경우 처리
    };

    useEffect(() => {
      const fetchUserName = async () => {
        try {
          const response = await axios.get('http://ceprj.gachon.ac.kr:60022/getUserName');
          const data = response.data;
    
          if (data.userName) {
            setUserName(data.userName);
          } else {
            console.error('사용자 이름을 가져오는데 실패했습니다.');
          }
        } catch (error) {
          console.error('사용자 이름을 가져오는 도중 오류 발생:', error);
        }
      };
    
      fetchUserName();
    }, []);
    
  
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
        <View style={styles.usernameContainer}>
          {userIcon}
          <Text style={styles.username}>username</Text>
        </View>
        <View style={styles.listsContainer}>
          <View style={styles.elementContainer}>
            <Text style={styles.text}>
              레시피 보관함
            </Text>
            <Pressable style={styles.icon} onPress={()=>navigation.navigate('Bookmark')}>
              {rightIcon}
            </Pressable>
          </View>
          <View style={styles.elementContainer}>
            <Text style={styles.text} onPress={()=>navigation.navigate('Analyse')}>
              사용자 지정 설정 수정
            </Text>
            <Pressable style={styles.icon}>
              {rightIcon}
            </Pressable>
          </View>
          <View style={styles.elementContainer}>
            <Text style={styles.text}>
              로그아웃
            </Text>
            <Pressable style={styles.icon} onPress={handleLogout}>
              {rightIcon}
            </Pressable>
          </View>
          <View style={styles.elementContainer}>
            <Text style={styles.text}>
              회원탈퇴
            </Text>
            <Pressable style={styles.icon}>
              {rightIcon}
            </Pressable>
          </View>
          <View style={styles.elementContainer}>
            <Text style={styles.text}>
              푸시알림
            </Text>
            <Pressable style={styles.icon}>
              {rightIcon}
            </Pressable>
          </View>
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
    usernameContainer:{
      position:'absolute',
      top:200,
      alignSelf:'center',
      flexDirection:'row',
      borderWidth:1,
      borderRadius:1,
      borderStyle:'solid',
      borderColor:'#858585',
      paddingHorizontal:20,
      paddingRight:50,
      paddingVertical:15,
    },
    username:{
      color:'black',
      fontSize:25,
      fontWeight:'500',
      marginLeft:20,
    },
    listsContainer:{
      flexDirection:'column',
      position:'absolute',
      top:350,
      alignItems:'left',
      alignSelf:'left',
    },
    elementContainer:{
      
      paddingHorizontal:20,
      paddingRight:50,
      paddingVertical:15,
      flexDirection:'row',
    },
    text:{
      color:'black',
      fontSize:20,
      fontWeight:'800',
    },
    icon:{

      paddingLeft:10,
      paddingTop:4,

    }


});

export default Settings;