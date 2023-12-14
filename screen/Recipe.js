import React from "react";
import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import recipes from "../recipes.json";
import axios from "axios";

const getSessionUserName = async () => {

  try{
      const response = await axios.get('http://ceprj.gachon.ac.kr:80/getUserName');
      console.log('Server response:', response.data);
      return response.data.userName;
  }catch(error){
      console.error('Error fetching user name:',error.message);
      return null;
  }
};

function Recipe() {
  const userIcon = <Icon name="user-circle" size={40} />;
  const navigation = useNavigation();
  const randomRecipeId = Math.floor(Math.random() * 2324) + 1;
  const like = <Icon2 name="thumbs-up" size={40} />;
  const dislike = <Icon2 name="thumbs-down" size={40} />;

  const findRecipeNameById = (id) => {
    const recipe = recipes.find(item => item.id === id);
    return recipe ? recipe.name : 'Recipe not found';
  };

  const foundRecipeName = findRecipeNameById(randomRecipeId);

  const findRecipeById = (id) => {
    const recipe = recipes.find(item => item.id === id);
    return recipe ? recipe.recipe : 'Recipe not found';
  };

  const foundRecipe = findRecipeById(randomRecipeId);

  const findIngredientsById = (id) => {
    const recipe = recipes.find(item=>item.id===id);
    return recipe ? JSON.parse(recipe.ingredient.replace(/'/g, '"')) : 'Ingredients not found';
  }

  const foundIngredients = findIngredientsById(randomRecipeId);

  const parseRecipe = (recipe) => {
    try {
      return JSON.parse(recipe.replace(/'/g, '"'));
    } catch (error) {
      console.error('Error parsing recipe:', error);
      return [];
    }
  };

  const parsedRecipe = parseRecipe(foundRecipe);
  

  return (
    <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
            <Pressable style={styles.usericonContainer} onPress={async () => {
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
                <Text style={styles.title}>
                Today's meal is ...
                </Text>
                <Text style={styles.food}>
                {foundRecipeName}
                </Text>
            </View>
            <View style={styles.recipeContainer}>
                <Text style={styles.recipeTitle}>재료</Text>
                {Array.isArray(foundIngredients) ? (
                foundIngredients.map((ingredient, index) => (
                <Text key={index} style={styles.recipeItem}>
                    {`${ingredient[0]} - ${ingredient[1]}`}
                </Text>
                ))
            ) : (
                <Text style={styles.recipeItem}>{JSON.stringify(foundIngredients)}</Text>
            )}
            <Text style={styles.recipeTitle}>조리 순서</Text>
            {Array.isArray(parsedRecipe) ? (
                parsedRecipe.map((sentence, index) => (
                <Text key={index} style={styles.recipeItem}>
                    {index + 1}. {sentence}
                    {'\n'}
                </Text>
                ))
            ) : (
                <Text style={styles.recipeItem}>{parsedRecipe}</Text>
            )}
            </View>
            <View style={styles.undertitleContainer}>
                <Text style={styles.undertitle}>오늘의 레시피 추천을 평가해주세요!</Text>
                <Text style={styles.underText}>다음 레시피 추천 시에 평가 내용을 반영해요.</Text>
                <Pressable style={{flexDirection:'row', justifyContent:'space-between'}}>
                    {like}
                    <View style={{width:30}}/>
                    {dislike}
                </Pressable>
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
    color:'black',
    padding:5,
  },
  recipeItem: {
    fontSize: 15,
    marginBottom: 10,
    padding:5,
    color:'black',
  },
  undertitleContainer:{
    alignItems:'center',
    padding:20,

  },
  undertitle:{

    alignSelf: 'center',
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  underText:{
    fontSize:13,
    padding:10,
  }
});

export default Recipe;