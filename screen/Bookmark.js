import React, {useEffect} from 'react';
import {Image, Text, View, StyleSheet, Pressable, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {CheckBox} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import recipes from '../recipes.json';
import axios from 'axios';

const getSessionUserName = async () => {
  try {
    const response = await axios.get(
      'http://ceprj.gachon.ac.kr:60022/getUserName',
    );
    //console.log('Server response:', response.data);
    return response.data.userName;
  } catch (error) {
    console.error('Error fetching user name:', error);
    return null;
  }
};

function Bookmark() {
  const userIcon = <Icon name="user-circle" size={40} />;
  const navigation = useNavigation();
  const [userName, setUserName] = useState(null);
  //북마크
  const [bookmarks, setBookmarks] = useState([]);
  //모달
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const openModal = bookmark => {
    // 레시피의 전체 데이터를 찾기
    const fullRecipe = recipes.find(recipe => recipe.id === bookmark.id);
    setSelectedRecipe(fullRecipe);
    setModalVisible(true);
  };

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

  // 북마크 목록을 서버로부터 가져오는 함수
  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(
        'http://ceprj.gachon.ac.kr:60022/getBookmarks',
      );
      setBookmarks(response.data.bookmarks); // 서버로부터 받은 북마크 목록을 상태에 저장
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const deleteBookmark = async (bookmarkId) => {
    try {
      await axios.delete(`http://ceprj.gachon.ac.kr:60022/deleteBookmark/${bookmarkId}`);
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.usericonContainer}
        onPress={() => navigation.navigate('Settings')}>
        {userIcon}
      </Pressable>
      <Text style={styles.title}>{userName}님의 보관함</Text>
      <ScrollView style={styles.scrollView}>
        {bookmarks.map((bookmark, index) => (
          <View key={index} style={styles.bookmarkItem}>
          <Pressable onPress={() => openModal(bookmark)}>
            <Text style={styles.bookmarkText}>{bookmark.name}</Text>
          </Pressable>
          <Pressable onPress={() => deleteBookmark(bookmark.id)}>
            <Text style={styles.deleteText}>삭제</Text>
          </Pressable>
        </View>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView style={styles.modalScrollView}>
              {selectedRecipe && (
                <View>
                  <Text style={styles.modalText}>{selectedRecipe.name}</Text>
                  <Text style={styles.modalText}>재료:</Text>
                  {selectedRecipe.ingredient &&
                    selectedRecipe.ingredient.map((ingredient, index) => (
                      <Text key={index} style={styles.modalText}>
                        {`${ingredient[0]} - ${ingredient[1]}`}
                      </Text>
                    ))}
                  <Text style={styles.modalText}>조리 방법:</Text>
                  {selectedRecipe.recipe &&
                    selectedRecipe.recipe.map((step, index) => (
                      <Text key={index} style={styles.modalText}>
                        {`${index + 1}. ${step}`}
                      </Text>
                    ))}
                </View>
              )}
            </ScrollView>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>닫기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    //alignItems: 'flex-start',
    margin: 0,
    backgroundColor: '#ffffff',
  },
  usericonContainer: {
    marginLeft: 340,
    marginTop: 15,
  },
  title: {
    marginTop: 50,
    marginLeft: 20,
    fontWeight: '900',
    fontSize: 30,
    color: 'black',
  },
  scrollView: {
    flex: 1,
  },
  bookmarkItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookmarkText: {
    fontSize: 16,
    color: 'black',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%', // 모달의 너비를 화면의 80%로 설정
    height: '80%', // 모달의 높이를 화면의 80%로 설정
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default Bookmark;
