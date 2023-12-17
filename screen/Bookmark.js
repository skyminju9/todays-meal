import React, {useEffect} from "react";
import {Image, Text, View, StyleSheet, Pressable} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";
import { CheckBox } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";

const getSessionUserName = async () => {

    try{
        const response = await axios.get('http://ceprj.gachon.ac.kr:60022/getUserName');
        //console.log('Server response:', response.data);
        return response.data.userName;
    }catch(error){
        console.error('Error fetching user name:',error);
        return null;
    }
};

function Bookmark(){

    const userIcon = <Icon name="user-circle" size={40} />;
    const navigation = useNavigation();
    const [userName, setUserName] = useState(null);

    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        const fetchUserName = async () => {
          try {
            const userNameFromSession = await getSessionUserName();
            if (userNameFromSession) {
              setUserName(userNameFromSession);
            }
          } catch (error) {
            console.error('Error fetching user name:', error);
          }
        };
        fetchUserName();
    }, [userName]);

    // 북마크 데이터를 서버로부터 가져오는 함수
    const fetchBookmarks = async () => {
        try {
          const response = await axios.get('http://ceprj.gachon.ac.kr:60022/getBookmarks');
          setBookmarks(response.data.bookmarks); // 서버로부터 받은 북마크 목록을 상태에 저장
        } catch (error) {
          console.error('Error fetching bookmarks:', error);
        }
      };
      
      useEffect(() => {
        fetchBookmarks();
      }, []);
    

    return(
        <View style = {styles.container}>
            <Pressable style = {styles.usericonContainer} onPress={()=>navigation.navigate('Settings')}>
                {userIcon}
            </Pressable>
            <Text style = {styles.title}>
                {userName}님의 보관함
            </Text>
 
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
    title:{
        marginTop:50,
        marginLeft:20,
        fontWeight:'900',
        fontSize:30,
        color:'black',
    }
})
export default Bookmark;