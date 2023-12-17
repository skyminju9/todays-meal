import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from ast import literal_eval
from sqlalchemy import create_engine
import requests

# 데이터 불러오기
# 사용자 
user_preferences = pd.read_csv('./data/preference_vector_data_100.csv')
seasonal_foods = pd.read_csv('./data/seasonal_vector_data_100.csv')
recipes = pd.read_csv('./data/recipes_vector_data_100.csv')

# 벡터 열 추출 및 NaN 값 처리
user_vector = user_preferences[['category_vector', 'ingredient_vector']].fillna(0).iloc[0]
seasonal_vector = seasonal_foods[seasonal_foods.columns[1:]].fillna(0).iloc[0]  # 첫 번째 열은 'month'로 가정
recipe_vector = recipes[['category_vector', 'ingredient_vector']].fillna(0)

# #데이터 확인
print(user_preferences.iloc[0])
print(seasonal_foods.iloc[0])

# 사용자 벡터 변환
def parse_vector(vector_str):
    # 대괄호 제거
    cleaned_str = vector_str.replace('[', '').replace(']', '').strip()
    # 공백으로 분리
    nums = cleaned_str.split()
    return np.array([float(num) for num in nums])

# 사용자 벡터와 레시피 벡터 변환(음식종류, 식재료 벡터 따로)
user_category_vector = parse_vector(user_vector['category_vector'])
user_ingredient_vector = parse_vector(user_vector['ingredient_vector'])
recipe_category_vectors = np.array([parse_vector(row['category_vector']) for _, row in recipes.iterrows()])
recipe_ingredient_vectors = np.array([parse_vector(row['ingredient_vector']) for _, row in recipes.iterrows()])
seasonal_ingredient_vector = parse_vector(' '.join([str(val) for val in seasonal_vector.values]))

# 각 벡터별 유사도 계산
category_similarities = cosine_similarity([user_category_vector], recipe_category_vectors)
# 식재료 벡터에 대한 유사도 계산(사용자 선호도 + 제철 식재료)
user_seasonal_ingredient_similarities = cosine_similarity([user_ingredient_vector + seasonal_ingredient_vector], recipe_ingredient_vectors)
# ingredient_similarities = cosine_similarity([user_ingredient_vector], recipe_ingredient_vectors)

# 가중치 설정
category_weight = 0.1 
ingredient_weight = 0.9 

# 유사도 조합(가중치 적용)
# combined_similarities = (category_similarities * category_weight + ingredient_similarities * ingredient_weight) / (category_weight + ingredient_weight)
combined_similarities = (category_similarities * category_weight + user_seasonal_ingredient_similarities * ingredient_weight) / (category_weight + ingredient_weight)


# 가장 유사한 레시피 찾기
top_recipe_indices = np.argsort(combined_similarities[0])[::-1][:5]
recommended_recipes = recipes.iloc[top_recipe_indices]

# 추천된 레시피에서 이름, 음식 종류, 식재료 열만 출력
print(recommended_recipes[['name', 'category', 'ingredient']])