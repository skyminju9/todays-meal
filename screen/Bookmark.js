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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedBookmarkId, setSelectedBookmarkId] = useState(null);

  const openModal = bookmark => {
    const fullRecipe = recipes.find(recipe => recipe.id === bookmark.id);
    if (fullRecipe) {
      // ingredient가 문자열인 경우 JSON 배열로 파싱
      if (typeof fullRecipe.ingredient === 'string') {
        try {
          // JSON 형식에 맞지 않는 문자열 처리
          const fixedIngredient = fullRecipe.ingredient.replace(/'/g, '"');
          fullRecipe.ingredient = JSON.parse(fixedIngredient);
        } catch (error) {
          console.error('Error parsing ingredients:', error);
          fullRecipe.ingredient = []; // 파싱 실패 시 빈 배열로 설정
        }
      }

      // recipe가 문자열인 경우 JSON 배열로 파싱
      if (typeof fullRecipe.recipe === 'string') {
        try {
          // JSON 형식에 맞지 않는 문자열 처리
          const fixedRecipe = fullRecipe.recipe.replace(/'/g, '"');
          fullRecipe.recipe = JSON.parse(fixedRecipe);
        } catch (error) {
          console.error('Error parsing recipe:', error);
          fullRecipe.recipe = []; // 파싱 실패 시 빈 배열로 설정
        }
      }

      setSelectedRecipe(fullRecipe);
      setModalVisible(true);
    }
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

  const openDeleteModal = bookmarkId => {
    setSelectedBookmarkId(bookmarkId);
    setDeleteModalVisible(true);
  };

  const deleteBookmark = async () => {
    try {
      await axios.delete(
        `http://ceprj.gachon.ac.kr:60022/deleteBookmark/${selectedBookmarkId}`,
      );
      setBookmarks(
        bookmarks.filter(bookmark => bookmark.id !== selectedBookmarkId),
      );
      setDeleteModalVisible(false); // 삭제 후 삭제 모달 닫기
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
        {bookmarks.length > 0 ? (
          bookmarks.map((bookmark, index) => (
            <View key={index} style={styles.bookmarkItem}>
              <Pressable onPress={() => openModal(bookmark)}>
                <Text style={styles.bookmarkText}>{bookmark.name}</Text>
              </Pressable>
              <Pressable onPress={() => openDeleteModal(bookmark.id)}>
                <Text style={styles.deleteText}>삭제</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <View style={styles.emptyMessageContainer}>
            <Text style={styles.emptyMessageText}>
              북마크된 레시피가 없습니다.
            </Text>
          </View>
        )}
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
                <View style={styles.modalRecipe}>
                  <Text style={styles.modalTextTitle}>
                    {selectedRecipe.name}
                  </Text>
                  <Text style={styles.modalTextMidtitle}>재료:</Text>
                  {selectedRecipe &&
                    selectedRecipe.ingredient &&
                    selectedRecipe.ingredient.map((ingredient, index) => (
                      <Text key={index} style={styles.modalText}>
                        {`${ingredient[0]} - ${ingredient[1]}`}
                      </Text>
                    ))}
                  <Text style={styles.modalTextMidtitle}>조리방법:</Text>
                  {selectedRecipe &&
                    selectedRecipe.recipe &&
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>삭제하시겠습니까?</Text>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={deleteBookmark}>
                <Text style={styles.textStyle}>예</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.textStyle}>아니오</Text>
              </Pressable>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookmarkText: {
    fontSize: 16,
    color: 'black',
  },
  deleteText: {
    fontSize: 16,
    color: 'red',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',
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
  modalRecipe: {
    alignItems: 'flex-start',
    padding: 20,
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
  modalTextTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 30,
    textAlign: 'center',
  },
  modalTextMidtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    color: 'black',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
    width: 80,
    alignItems: 'center',
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: 20,
  },
  emptyMessageText: {
    marginTop: 50,
    // marginLeft: 20,
    fontSize: 20,
    color: 'grey',
  },
});
export default Bookmark;
