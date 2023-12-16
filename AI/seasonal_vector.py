import pandas as pd
from gensim.models import Word2Vec
from nltk.tokenize import word_tokenize
import numpy as np

# CSV 파일 불러오기
seasonal_food_data = pd.read_csv('./data/preprocessed_seasonal_food.csv')

# 모델
ingredient_model = Word2Vec.load("ingredient_model.model")

# 'ingredient'에 대한 데이터 토큰화
tokenized_ingredient_data = [word_tokenize(sentence) for sentence in seasonal_food_data['ingredient']]

# 각 월별 식재료를 벡터로 변환
month_vectors = []
for month, ingredients in zip(seasonal_food_data['month'], tokenized_ingredient_data):
    # 모델에 있는 재료만 사용하여 벡터 계산
    valid_ingredients = [ingredient for ingredient in ingredients if ingredient in ingredient_model.wv]
    if valid_ingredients:
        month_vector = np.mean([ingredient_model.wv[ingredient] for ingredient in valid_ingredients], axis=0)
    else:
        month_vector = np.zeros(ingredient_model.vector_size)
    month_vectors.append(month_vector)

# 월별 식재료 벡터를 DataFrame으로 변환
month_vector_df = pd.DataFrame(month_vectors, index=seasonal_food_data['month'])

# 결과를 파일로 저장
# output_path = './data/seasonal_vector_data.csv'
output_path = './data/seasonal_vector_data_100.csv'
month_vector_df.to_csv(output_path, index=True, encoding='utf-8')

print(f"월별 식재료 벡터가 '{output_path}'에 저장되었습니다.")