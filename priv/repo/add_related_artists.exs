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

related_artists = Path.absname('priv/repo/seeds/related_artists.csv')
SpotifyTracker.Repo.query!("COPY related_artists(artist_spot_id,related_spot_id) from '#{related_artists}' WITH CSV HEADER;")
