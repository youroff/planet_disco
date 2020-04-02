# Script for converting source data into collection of CSV files
# for direct DB uplodad (seed.exs):
#
#     mix run priv/repo/get_images.exs source_dir

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

# Caching artists
artists_cache = File.stream!("priv/repo/seeds/artists.csv")
|> CSV.decode(headers: true)
|> Stream.filter(&MonEx.Result.is_ok/1)
|> Stream.map(&MonEx.Result.unwrap/1)
|> Stream.map(& {&1["spotify_id"], &1["id"]})
|> Enum.into(%{})

artists = :ets.new(:artists, [:set, :public])

# Stuffing Artists and Genres into ETS
Path.wildcard(import_dir <> "/artists/**/*.json")
|> Flow.from_enumerable()
|> Flow.flat_map(fn file ->
  File.read(file)
  |> MonEx.flat_map(&Jason.decode/1)
  |> MonEx.map(& &1["artists"])
  |> MonEx.Result.unwrap([])
end)
|> Flow.map(fn artist ->
  :ets.insert_new(artists, {artist["id"], artist["images"]})
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
  :ets.insert_new(artists, {artist["id"], artist["images"]})
end)
|> Flow.run()

:ets.foldl(fn {id, images}, acc ->
  Enum.reduce(images, acc, fn image, acc2 ->
    with {:ok, artist_id} <- Map.fetch(artists_cache, id) do
      [Map.put(image, :artist_id, artist_id) | acc2]
    else
      _ -> acc2
    end
  end)
end, [], artists)
|> CSV.encode(headers: true)
|> Stream.into(File.stream!("priv/repo/seeds/images.csv"))
|> Stream.run()
