import pandas as pd
df = pd.read_csv("./seeds/embeddings_processed.csv")
df['em_coord'] = df.apply(lambda x: "SRID=4326;Point({} {})".format(x.em_y, x.em_x), axis=1)
df = df[['city_id', 'em_coord', 'geohash']]
df.columns = ['id', 'em_coord', 'geohash']

df_cities = pd.read_csv("./seeds/cities.csv")
df_cities = df_cities.merge(df, how='left')
df_cities.to_csv("./seeds/embedding_points.csv", index=False)
