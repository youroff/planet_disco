# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     SpotifyTracker.Repo.insert!(%SpotifyTracker.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

cities = Path.absname('priv/repo/seeds/embedding_points.csv')
SpotifyTracker.Repo.query!("COPY cities(id,city,region,country,human_region,human_country,population,coord,em_coord,geohash) from '#{cities}' WITH CSV HEADER;")

genres = Path.absname('priv/repo/seeds/genres.csv')
SpotifyTracker.Repo.query!("COPY genres(id,name) from '#{genres}' WITH CSV HEADER;")

artists = Path.absname('priv/repo/seeds/artists.csv')
SpotifyTracker.Repo.query!("COPY artists(followers,name,popularity,spotify_id,bio,id,monthly_listeners) from '#{artists}' WITH CSV HEADER;")

images = Path.absname('priv/repo/seeds/images.csv')
SpotifyTracker.Repo.query!("COPY images(artist_id,height,path,width) from '#{images}' WITH CSV HEADER;")

artist_cities = Path.absname('priv/repo/seeds/artist_cities.csv')
SpotifyTracker.Repo.query!("COPY artist_cities(artist_id,city_id,listeners,score) from '#{artist_cities}' WITH CSV HEADER;")

artist_genres = Path.absname('priv/repo/seeds/artist_genres.csv')
SpotifyTracker.Repo.query!("COPY artist_genres(artist_id,genre_id) from '#{artist_genres}' WITH CSV HEADER;")
