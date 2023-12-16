import React, { useState, useEffect } from "react";
import { Image, Text, View, StyleSheet, Pressable } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";

const getSessionUserName = async () => {
  try {
    const response = await axios.get('http://ceprj.gachon.ac.kr:60022/getUserName');
    return response.data.userName;
  } catch (error) {
    console.error('Error fetching user name:', error);
    return null;
  }
};

const getSessionUserId = async () => {
  try {
    // Implement the logic to get the user ID from the session
    // For example:
    const response = await axios.get('http://ceprj.gachon.ac.kr:60022/getUserId');
    return response.data.userId;
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
};

function Settings() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState(null);
  const [userid, setUserId] = useState(null);  // Add this line
  const userIcon = <Icon name="user-circle" size={40} />;
  const rightIcon = <Icon2 name="right" size={20} />;
  const bell = <Icon3 name="bell" size={20} />;
  const bellOff = <Icon3 name="bell-off" size={20} />;
  const [isOn, setIsOn] = useState(true);

  const handlePress = async () => {
    try {
      // Send a request to update pushNotificationSetting on the server
      const response = await axios.post('http://ceprj.gachon.ac.kr:60022/updatePushNotificationSetting', {
        pushNotificationSetting: !isOn,
      });

      const data = response.data;

      if (data.success) {
        // Update the state locally
        setIsOn(!isOn);
      } else {
        console.error('Failed to update push notification setting:', data.message);
        // Handle failure if needed
      }
    } catch (error) {
      console.error('Error updating push notification setting:', error);
      // Handle error if needed
    }
  };

  const handlePressAnalyse = () => {
    navigation.navigate('Analyse', { userName, userid });
  };

  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청 보내기
      const response = await axios.post('http://ceprj.gachon.ac.kr:60022/logout');
      const data = response.data;

      if (data.success) {
        // 세션 정보 클리어
        clearSession();
        setUserName(null);
        fetchUserName();
        navigation.navigate('Home');
      } else {
        console.error('로그아웃 실패', data.message);
        // 실패 시에 대한 처리
      }
    } catch (error) {
      console.error('로그아웃 요청 중 오류 발생', error);
      // 오류 발생 시에 대한 처리
    }
  };

  const fetchUserId = async () => {
    try {
      const useridFromSession = await getSessionUserId(); // Use your actual function here
      setUserId(useridFromSession); // Set the user ID state
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

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

  useEffect(() => {
    fetchUserName();
  }, [userid]);

  const handleDeleteAccount = async () => {
    try {
      // Send a request to the server to delete the account
      const response = await axios.post('http://ceprj.gachon.ac.kr:60022/deleteAccount');
      const data = response.data;

      if (data.success) {
        // After successful deletion, navigate to the Home screen
        navigation.navigate('Home');
      } else {
        console.error('Account deletion failed', data.message);
        // Handle deletion failure
      }
    } catch (error) {
      console.error('Account deletion request error', error);
      // Handle request error
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
      <View style={styles.usernameContainer}>
        {userIcon}
        <Text style={styles.username}>{userName}</Text>
      </View>
      <View style={styles.listsContainer}>
        <View style={styles.elementContainer}>
          <Text style={styles.text}>
            레시피 보관함
          </Text>
          <Pressable style={styles.icon} onPress={() => navigation.navigate('Bookmark')}>
            {rightIcon}
          </Pressable>
        </View>
        <View style={styles.elementContainer}>
          <Text style={styles.text}>
            사용자 지정 설정 수정
          </Text>
          <Pressable style={styles.icon} onPress={handlePressAnalyse}>
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
          <Pressable style={styles.icon} onPress={handleDeleteAccount}>
            {rightIcon}
          </Pressable>
        </View>
        <View style={styles.elementContainer}>
          <Text style={styles.text}>
            푸시알림
          </Text>
          <Pressable style={styles.icon} onPress={handlePress}>
            {isOn ? bell : bellOff}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    margin: 0,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    marginLeft: 10,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  titleContainer: {
    position: 'absolute',
    top: 100,
    alignSelf: 'left',
    marginLeft: 20,
  },
  title: {
    color: 'black',
    fontSize: 30,
    fontWeight: '700',
  },
  usernameContainer: {
    position: 'absolute',
    top: 200,
    alignSelf: 'left',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingRight: 50,
    paddingVertical: 15,
  },
  username: {
    color: 'black',
    fontSize: 25,
    fontWeight: '500',
    marginLeft: 20,
  },
  listsContainer: {
    flexDirection: 'column',
    position: 'absolute',
    top: 300,
    alignItems: 'left',
    alignSelf: 'left',
  },
  elementContainer: {
    paddingHorizontal: 20,
    paddingRight: 50,
    paddingVertical: 15,
    flexDirection: 'row',
  },
  text: {
    color: 'black',
    fontSize: 20,
    fontWeight: '800',
  },
  icon: {
    paddingLeft: 10,
    paddingTop: 4,
  },
});

export default Settings;
