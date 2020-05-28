# Script for converting source data into collection of CSV files
# for direct DB uplodad (seed.exs):
#
#     mix run priv/repo/importer.exs source_dir

# This is a formal check that verifies that given directory exists
# and has 'artists' and 'cities' subdirectories:
import_dir = with [dirname] <- System.argv(),
  {:ok, %File.Stat{type: :directory}} <- File.lstat(dirname),
  {:ok, %File.Stat{type: :directory}} <- File.lstat(dirname <> "/artists"),
  {:ok, %File.Stat{type: :directory}} <- File.lstat(dirname <> "/cities")
do
  dirname
else
  _ -> exit("Import dir structure is invalid")
end

# Caching genres
genres_cache = File.stream!("priv/repo/seeds/genres.csv")
|> CSV.decode(headers: true)
|> Stream.filter(&MonEx.Result.is_ok/1)
|> Stream.map(&MonEx.Result.unwrap/1)
|> Stream.map(& {&1["name"], &1["id"]})
|> Enum.into(%{})

# Caching artists
artists_cache = File.stream!("priv/repo/seeds/artists.csv")
|> CSV.decode(headers: true)
|> Stream.filter(&MonEx.Result.is_ok/1)
|> Stream.map(&MonEx.Result.unwrap/1)
|> Stream.map(& {&1["spotify_id"], &1["id"]})
|> Enum.into(%{})

artists = :ets.new(:artists, [:set, :public])

# Stuffing Artists into ETS
Path.wildcard(import_dir <> "/artists/**/*.json")
|> Flow.from_enumerable()
|> Flow.flat_map(fn file ->
  File.read(file)
  |> MonEx.flat_map(&Jason.decode/1)
  |> MonEx.map(& &1["artists"])
  |> MonEx.Result.unwrap([])
end)
|> Flow.map(fn artist ->
  :ets.insert_new(artists, {artist["id"], artist["genres"]})
end)
|> Flow.run()

Path.wildcard(import_dir <> "/seed/*.json")
|> Flow.from_enumerable()
|> Flow.flat_map(fn file ->
  File.read(file)
  |> MonEx.flat_map(&Jason.decode/1)
  |> MonEx.map(& &1["artists"]["items"])
  |> MonEx.Result.unwrap([])
end)
|> Flow.map(fn artist ->
  :ets.insert_new(artists, {artist["id"], artist["genres"]})
end)
|> Flow.run()

File.mkdir_p!("priv/repo/seeds")
:ets.foldl(fn {id, genres}, acc ->
  Enum.reduce(genres, acc, fn genre, acc2 ->
    with {:ok, genre_id} <- Map.fetch(genres_cache, genre),
      {:ok, artist_id} <- Map.fetch(artists_cache, id)
    do
      [%{artist_id: artist_id, genre_id: genre_id} | acc2]
    else
      _ ->
        IO.inspect([genre, Map.fetch(genres_cache, genre), id, Map.fetch(artists_cache, id)])
        acc2
    end
  end)
end, [], artists)
|> CSV.encode(headers: true)
|> Stream.into(File.stream!("priv/repo/seeds/artist_genres.csv"))
|> Stream.run()
