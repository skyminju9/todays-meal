import {React, useState, useEffect} from 'react';
import {Text, View, StyleSheet, Pressable, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
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

  const handleLike = () => {
    const recipeid = fullRecipeData.id; // 현재 레시피 ID
    axios.post('http://ceprj.gachon.ac.kr:60022/bookmark', { recipeid })
      .then(response => {
        // 북마크 추가 성공 로직
        console.log('Bookmark added:', response.data.message);
      })
      .catch(error => {
        // 에러 처리 로직
        console.error('Error adding bookmark:', error.message);
      });
    };
  
    const handleDislike = () => {
      fetchRecommendation();
    };

  const fetchRecommendation = async () => {
    //서버에서 추천된 레시피를 가져오는 로직
    try {
      const userId = await getSessionUserId(); // 사용자 ID 가져옴
      console.log('userId: ', userId);
      if (userId) {
        const response = await axios.post(
          'http://ceprj.gachon.ac.kr:60022/recommend',
          {
            user_id: userId,
          },
        );
        const recommendedRecipeName = response.data.recommend; // 서버로부터 받은 레시피 이름
        findFullRecipeData(recommendedRecipeName);
      }
    } catch (error) {
      console.error('Error fetching recommendation:', error);
    }
  };

  useEffect(() => {
    fetchRecommendation();
  }, []);

  const findFullRecipeData = recipeName => {
    // 레시피 이름이 배열인 경우, 첫 번째 요소를 사용
    const recipeNameStr = Array.isArray(recipeName)
      ? recipeName[0]
      : recipeName;
    const foundRecipe = recipes.find(r => r.name === recipeNameStr);

    if (foundRecipe) {
      // ingredient를 JSON 파싱하여 배열로 변환
      let ingredient = foundRecipe.ingredient;
      if (typeof ingredient === 'string') {
        ingredient = JSON.parse(ingredient.replace(/'/g, '"'));
      }
      // recipe를 JSON 파싱하여 배열로 변환
      let recipe = foundRecipe.recipe;
      if (typeof recipe === 'string') {
        recipe = JSON.parse(recipe.replace(/'/g, '"'));
      }
      // recipe를 JSON 파싱하여 배열로 변환
      let recipeid = foundRecipe.id;
      if (typeof recipe === 'string') {
        recipeid = JSON.parse(recipe.replace(/'/g, '"'));
      }

      foundRecipe.ingredient = ingredient;
      foundRecipe.recipe = recipe;
      foundRecipe.id = recipeid;

      setFullRecipeData(foundRecipe);
    } else {
      console.error('Recipe not found:', recipeNameStr);
    }
  };

  if (!fullRecipeData) {
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* 사용자 아이콘 및 타이틀 컨테이너 */}
          <Text style={styles.title}>Loading recipe...</Text>
        </View>
      </ScrollView>
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
            오늘의 레시피 추천을 평가해주세요!
          </Text>
          <Text style={styles.underText}>
            다음 레시피 추천 시에 평가 내용을 반영해요.
          </Text>
          <Pressable onPress={handleLike}
            style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {like}</Pressable>
            <View style={{width: 30}} />
            <Pressable onPress={handleDislike}
            style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {dislike}</Pressable>
        </View>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  underText: {
    fontSize: 13,
    padding: 10,
  },
});

export default Recipe;
