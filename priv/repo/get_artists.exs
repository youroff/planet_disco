# Script for converting source data into collection of CSV files
# for direct DB uplodad (seed.exs):
#
#     mix run priv/repo/importer.exs source_dir

import MonEx.Result

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
  :ets.insert_new(artists, {artist["id"], %{
    spotify_id: artist["id"],
    name: artist["name"],
    followers: artist["followers"]["total"],
    popularity: artist["popularity"]
  }})
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
  :ets.insert_new(artists, {artist["id"], %{
    spotify_id: artist["id"],
    name: artist["name"],
    followers: artist["followers"]["total"],
    popularity: artist["popularity"]
  }})
end)
|> Flow.run()

# Processing actual artists
Path.wildcard(import_dir <> "/cities/**/*.json")
|> Enum.with_index(1)
|> Flow.from_enumerable()
|> Flow.map(fn {file, id} ->
  File.read(file)
  |> MonEx.flat_map(&Jason.decode/1)
  |> MonEx.flat_map(fn artist ->
    artist_id = Path.basename(file, ".json")
    with [{_, cached}] <- :ets.lookup(artists, artist_id) do
      ok(Map.merge(cached, %{"monthly_listeners" => artist["artistInsights"]["monthly_listeners"], "bio" => artist["bio"], "id" => id}))
    else
      _ ->
        IO.inspect(["This one didn't match", artist_id])
        error("Huy")
    end
  end)
end)
|> Flow.filter(&MonEx.Result.is_ok/1)
|> Flow.map(&MonEx.Result.unwrap/1)
|> CSV.encode(headers: true)
|> Stream.into(File.stream!("priv/repo/seeds/artists.csv"))
|> Stream.run()
