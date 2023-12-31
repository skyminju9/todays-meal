import sys
import json
from gensim.models import Word2Vec
import pandas as pd
import numpy as np
import random
from sklearn.metrics.pairwise import cosine_similarity


# 데이터 로드, 모델 로드 o
seasonal_foods = pd.read_csv('../data/seasonal_vector_data_100.csv')
recipes = pd.read_csv('../data/recipes_vector_data_100.csv')

category_model = Word2Vec.load("../AI/category_model.model")
ingredient_model = Word2Vec.load("../AI/ingredient_model.model")

# 벡터 열 추출 및 NaN 값 처리
# user_vector = user_preferences[['category_vector', 'ingredient_vector']].fillna(0).iloc[0]
seasonal_vector = seasonal_foods[seasonal_foods.columns[1:]].fillna(0).iloc[11]  #12월
recipe_vector = recipes[['category_vector', 'ingredient_vector']].fillna(0)

# 벡터 변환
def parse_vector(vector_str):
    # 대괄호 제거
    cleaned_str = vector_str.replace('[', '').replace(']', '').strip()
    # 공백으로 분리
    nums = cleaned_str.split()
    return np.array([float(num) for num in nums])

# 레시피 벡터와 제철 식재료 벡터 변환(음식종류, 식재료 벡터 따로)
recipe_category_vectors = np.array([parse_vector(row['category_vector']) for _, row in recipes.iterrows()])
recipe_ingredient_vectors = np.array([parse_vector(row['ingredient_vector']) for _, row in recipes.iterrows()])
seasonal_ingredient_vector = parse_vector(' '.join([str(val) for val in seasonal_vector.values]))

def create_preference_vector(items, model):
    filtered_items = [item for item in items if item in model.wv]
    vectors = [model.wv[item] for item in filtered_items]
    if vectors:
        return np.mean(vectors, axis=0)
    else:
        return np.zeros(model.vector_size)

def main(user_id, user_preferences):

        # 사용자 선호도에 대한 벡터 생성
        user_category_vector = create_preference_vector(user_preferences['typeOfFood'], category_model)
        user_ingredient_vector = create_preference_vector(user_preferences['selectedData'], ingredient_model)

        # 각 벡터별 유사도 계산
        category_similarities = cosine_similarity([user_category_vector], recipe_category_vectors)
        # 식재료 벡터에 대한 유사도 계산(사용자 선호도 + 제철 식재료)
        user_seasonal_ingredient_similarities = cosine_similarity([user_ingredient_vector + seasonal_ingredient_vector], recipe_ingredient_vectors)
        # ingredient_similarities = cosine_similarity([user_ingredient_vector], recipe_ingredient_vectors)

        # 가중치 설정
        category_weight = random.uniform(0, 0.00005) 
        ingredient_weight = random.uniform(0, 0.01)

        # 유사도 조합
        combined_similarities = (category_similarities * category_weight + user_seasonal_ingredient_similarities * ingredient_weight) / (category_weight + ingredient_weight)

        # 가장 유사한 레시피 추천
        top_recipe_idx = np.argsort(combined_similarities[0])[::-1][:90]
        recommended_index = random.choice(top_recipe_idx)
        recommended_recipe = recipes.iloc[recommended_index]
        # return jsonify(recommended_recipes.name).to_json(orient="records", force_ascii=False)
        print(json.dumps({"name": recommended_recipe['name']}))

if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=60022)
    user_id = sys.argv[1]
    user_preferences = json.loads(sys.argv[2])
    main(user_id, user_preferences)