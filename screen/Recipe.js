import {React, useState, useEffect} from 'react';
import {Image, Text, View, StyleSheet, Pressable, ScrollView, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import recipes from '../recipes.json';
import axios from 'axios';

const getSessionUserName = async () => {
  try {
    const response = await axios.get(
      'http://ceprj.gachon.ac.kr:60022/getUserName',
    );
    console.log('Server response:', response.data);
    return response.data.userName;
  } catch (error) {
    console.error('Error fetching user name:', error.message);
    return null;
  }
};

const getSessionUserId = async () => {
  try {
    const response = await axios.get(
      'http://ceprj.gachon.ac.kr:60022/getUserId',
    );
    if (response.data.userId) {
      console.log('Server response:', response.data.userId);
      return response.data.userId;
    } else {
      console.error('User ID is null:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
};

function Recipe() {
  const userIcon = <Icon name="user-circle" size={40} />;
  const navigation = useNavigation();
  const like = <Icon2 name="thumbs-up" size={40} />;
  const dislike = <Icon2 name="thumbs-down" size={40} />;

  // const [recipeData, setRecipeData] = useState(null);
  const [fullRecipeData, setFullRecipeData] = useState(null);

  const [modalVisible, setModalVisible] = useState(false); // 모달의 표시 여부 상태
  const [bookmarkMessage, setBookmarkMessage] = useState(''); // 북마크 메시지 상태
  const [isBookmarked, setIsBookmarked] = useState(false); // 북마크 상태

  const handleLike = () => {
    const recipeid = fullRecipeData.id; // 현재 레시피 ID
    if (isBookmarked) {
      // 이미 북마크된 상태
      setBookmarkMessage('이미 북마크된 레시피입니다.');
      setModalVisible(true);
    } else {
      // 북마크되지 않은 상태
      axios
        .post('http://ceprj.gachon.ac.kr:60022/bookmark', {recipeid})
        .then(response => {
          console.log('Bookmark added:', response.data.message);
          setIsBookmarked(true);
          setBookmarkMessage('레시피가 북마크되었습니다.');
          setModalVisible(true);
        })
        .catch(error => {
          // 에러 처리 로직
          console.error('Error adding bookmark:', error.message);
        });
    }
  };

  const fetchRecommendation = async () => {
    const userId = await getSessionUserId();
    if (!userId) {
      console.error('User ID not found.');
      return;
    }
  
    try {
      const response = await axios.post('http://ceprj.gachon.ac.kr:60022/recommend', { user_id: userId });
      const recommendedRecipeName = response.data.recommend;
      findFullRecipeData(recommendedRecipeName);
      await AsyncStorage.setItem('lastRecommendedRecipe', JSON.stringify(recommendedRecipeName));
    } catch (error) {
      console.error('Error fetching recommendation:', error);
    }
  };
  
  const handleDislike = () => {
    fetchRecommendation();
  };
  


  useEffect(() => {
    // 로컬 스토리지에서 마지막 추천 레시피 불러옴
    const getLastRecommendedRecipe = async () => {
      try {
        const lastRecommendedRecipe = await AsyncStorage.getItem('lastRecommendedRecipe');
        if (lastRecommendedRecipe !== null) {
          findFullRecipeData(JSON.parse(lastRecommendedRecipe));
        } else {
          fetchRecommendation(); // 로컬 스토리지에 없으면 새로운 추천 레시피를 가져옴
        }
      } catch (error) {
        console.error('AsyncStorage 불러오기 중 오류 발생:', error);
      }
    };
  
    getLastRecommendedRecipe();
  }, []);

  const findFullRecipeData = recipeName => {
    const recipeNameStr = Array.isArray(recipeName) ? recipeName[0] : recipeName;
    const foundRecipe = recipes.find(r => r.name === recipeNameStr);
  
    if (foundRecipe) {
      let ingredient = foundRecipe.ingredient;
      let recipe = foundRecipe.recipe;
  
      if (typeof ingredient === 'string') {
        try {
          ingredient = JSON.parse(ingredient.replace(/'/g, '"'));
        } catch (error) {
          console.error('Error parsing ingredients:', error);
          ingredient = [];
        }
      }
  
      if (typeof recipe === 'string') {
        try {
          recipe = JSON.parse(recipe.replace(/'/g, '"'));
        } catch (error) {
          console.error('Error parsing recipe:', error);
          recipe = [];
        }
      }
  
      foundRecipe.ingredient = ingredient || [];
      foundRecipe.recipe = recipe || [];
      setFullRecipeData(foundRecipe);
    } else {
      console.error('Recipe not found:', recipeNameStr);
    }
  };

  if (!fullRecipeData) {
    return (
      <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source = {require('../image/logo.png')} style={styles.image}/>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
        Loading recipe...
        </Text>
      </View>
    </View>
      
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Pressable
          style={styles.usericonContainer}
          onPress={async () => {
            // 사용자 정보를 세션에 설정
            const userName = await getSessionUserName();
            if (userName) {
              navigation.navigate('Settings');
            } else {
              // 사용자 정보가 없을 경우 예외 처리
              console.error('User information not found.');
            }
          }}>
          {userIcon}
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Today's meal is ...</Text>
          <Text style={styles.food}>{fullRecipeData.name}</Text>
        </View>
        <View style={styles.recipeContainer}>
          <Text style={styles.recipeTitle}>재료</Text>
          {Array.isArray(fullRecipeData.ingredient) ? (
            fullRecipeData.ingredient.map((ingredient, index) => (
              <Text key={index} style={styles.recipeItem}>
                {`${ingredient[0]} - ${ingredient[1]}`}
              </Text>
            ))
          ) : (
            <Text style={styles.recipeItem}>
              {JSON.stringify(fullRecipeData.ingredient)}
            </Text>
          )}
          <Text style={styles.recipeTitle}>조리 순서</Text>
          {fullRecipeData.recipe.map((step, index) => (
            <Text key={index} style={styles.recipeItem}>
              {index + 1}. {step}
              {'\n'}
            </Text>
          ))}
        </View>
        <View style={styles.undertitleContainer}>
          <Text style={styles.undertitle}>
            오늘의 레시피를 북마크하거나 재추천받을 수 있어요.
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={handleLike}
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {like}
            </Pressable>
            <View style={{width: 30}} />
            <Pressable
              onPress={handleDislike}
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {dislike}
            </Pressable>
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{bookmarkMessage}</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>확인</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    margin: 0,
    backgroundColor: '#ffffff',
  },
  titleContainer: {
    marginVertical: 20,
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 35,
    fontWeight: '500',
  },
  food: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 30,
    fontWeight: '900',
  },
  usericonContainer: {
    marginLeft: 340,
    marginTop: 15,
    marginBottom: 50,
  },
  scrollView: {
    flex: 1,
  },
  recipeContainer: {
    backgroundColor: '#EDF6FF',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    padding: 10,
  },
  recipeTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    padding: 5,
  },
  recipeItem: {
    fontSize: 15,
    marginBottom: 10,
    padding: 5,
    color: 'black',
  },
  undertitleContainer: {
    alignItems: 'center',
    padding: 20,
  },
  undertitle: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  modalView: {
    width: '80%', // 모달의 너비를 화면의 80%로 설정
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageContainer:{
    flex:0.5,
    alignItems:'center',
    justifyContent:'center',
  },
  image:{
    width:200,
    height:200,
    resizeMode:'cover',
  },
});

export default Recipe;
