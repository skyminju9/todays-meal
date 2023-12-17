import pandas as pd
from gensim.models import Word2Vec
import numpy as np

# CSV 파일 불러오기
recipe_data = pd.read_csv('./data/preprocessed_recipes.csv')

# 'category'와 'ingredient'를 공백으로 분리하여 단어 리스트 생성, 누락된 값 확인 및 처리
recipe_data['category'] = recipe_data['category'].fillna('').str.split()
recipe_data['ingredient'] = recipe_data['ingredient'].fillna('').str.split()

# Word2Vec 모델 학습
category_model = Word2Vec(sentences=recipe_data['category'].tolist(), vector_size=100, window=5, min_count=1, workers=4)
ingredient_model = Word2Vec(sentences=recipe_data['ingredient'].tolist(), vector_size=100, window=5, min_count=1, workers=4)

# 각 레시피에 대한 벡터 생성 함수
def create_recipe_vector(items, model):
    vectors = [model.wv[item] for item in items if item in model.wv]
    return np.mean(vectors, axis=0) if vectors else np.zeros(model.vector_size)

# 각 레시피에 대한 벡터 생성
recipe_data['category_vector'] = recipe_data['category'].apply(lambda x: create_recipe_vector(x, category_model))
recipe_data['ingredient_vector'] = recipe_data['ingredient'].apply(lambda x: create_recipe_vector(x, ingredient_model))

# 벡터 데이터를 DataFrame에 추가
category_vectors_df = pd.DataFrame(recipe_data['category_vector'].tolist())
ingredient_vectors_df = pd.DataFrame(recipe_data['ingredient_vector'].tolist())

# 벡터 데이터를 'category_vector'와 'ingredient_vector'라는 이름으로 저장
category_vectors_df.columns = [f'category_vector_{i}' for i in range(category_vectors_df.shape[1])]
ingredient_vectors_df.columns = [f'ingredient_vector_{i}' for i in range(ingredient_vectors_df.shape[1])]

# 원본 데이터에 벡터 데이터를 결합
combined_df = pd.concat([recipe_data, category_vectors_df, ingredient_vectors_df], axis=1)

# 파일로 저장
# output_path = './data/recipes_vector_data.csv'
output_path = './data/recipes_vector_data_100.csv'
combined_df.to_csv(output_path, index=False, encoding='utf-8')

# 모델 저장
category_model.save("category_model.model")
ingredient_model.save("ingredient_model.model")

# 나중에 모델 불러오기
category_model = Word2Vec.load("category_model.model")
ingredient_model = Word2Vec.load("ingredient_model.model")

print(f"파일이 '{output_path}'에 저장되었습니다.")