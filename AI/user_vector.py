# 필요한 패키지
import pandas as pd
from gensim.models import Word2Vec
import numpy as np
from ast import literal_eval
import requests
import sqlalchemy  # 데이터베이스 접속을 위한 라이브러리

# 데이터베이스 접속 설정
database_url = "http://ceprj.gachon.ac.kr:60022"  # 데이터베이스 URL
table_name = "saveUserSelections"  # 데이터를 읽어올 테이블 이름

# 데이터베이스 엔진 생성
engine = sqlalchemy.create_engine(database_url)
# 데이터베이스에서 데이터 불러오기
preference_data = pd.read_sql(table_name, engine)

# # CSV 파일 불러오기
# preference_data = pd.read_csv('./data/preference_data.csv')

# 'category'와 'ingredient' 열의 문자열을 리스트로 변환
preference_data['category'] = preference_data['category'].apply(literal_eval)
preference_data['ingredient'] = preference_data['ingredient'].apply(literal_eval)

# 각 사용자 선호도에 대한 전체 단어 리스트를 생성
all_categories = [category for categories in preference_data['category'] for category in categories]
all_ingredients = [ingredient for ingredients in preference_data['ingredient'] for ingredient in ingredients]

# Word2Vec 모델 학습
category_model = Word2Vec(sentences=[all_categories], vector_size=100, window=5, min_count=1, workers=4)
ingredient_model = Word2Vec(sentences=[all_ingredients], vector_size=100, window=5, min_count=1, workers=4)

# 각 사용자 선호도에 대한 벡터 생성
def create_preference_vector(items, model):
    vectors = [model.wv[item] for item in items if item in model.wv]
    if vectors:
        return np.mean(vectors, axis=0)
    else:
        return np.zeros(model.vector_size)

preference_data['category_vector'] = preference_data['category'].apply(lambda x: create_preference_vector(x, category_model))
preference_data['ingredient_vector'] = preference_data['ingredient'].apply(lambda x: create_preference_vector(x, ingredient_model))

# 결과 확인
preference_data[['id', 'category_vector', 'ingredient_vector']].head()

# 사용자 선호도 데이터의 임베딩 벡터를 파일로 저장하기 위한 코드

# 벡터 데이터를 DataFrame에 추가
category_vectors_df = pd.DataFrame(preference_data['category_vector'].tolist())
ingredient_vectors_df = pd.DataFrame(preference_data['ingredient_vector'].tolist())

# 벡터 데이터를 'category_vector'와 'ingredient_vector'라는 이름으로 저장
category_vectors_df.columns = [f'category_vector_{i}' for i in range(category_vectors_df.shape[1])]
ingredient_vectors_df.columns = [f'ingredient_vector_{i}' for i in range(ingredient_vectors_df.shape[1])]

# 원본 데이터에 벡터 데이터를 결합
combined_df = pd.concat([preference_data, category_vectors_df, ingredient_vectors_df], axis=1)

# 파일로 저장
# output_path = './data/preference_vector_data.csv'
output_path = './data/preference_vector_data_100.csv'
combined_df.to_csv(output_path, index=False, encoding='utf-8')

print(f"파일이 '{output_path}'에 저장되었습니다.")
