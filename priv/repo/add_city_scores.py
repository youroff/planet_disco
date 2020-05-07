import pandas as pd

scores_df = pd.read_csv("./seeds/scores.csv")
artists_df = pd.read_csv("./seeds/artist_cities.csv")
merged = artists_df.merge(scores_df)
res = merged[['artist_id', 'city_id', 'listeners', 'score']]
res.to_csv("./seeds/artist_cities.csv", index=False)
