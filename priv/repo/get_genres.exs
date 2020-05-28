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

# artists = :ets.new(:artists, [:set, :public])
genres = :ets.new(:genres, [:set, :public])

# Stuffing Genres into ETS
Path.wildcard(import_dir <> "/artists/**/*.json")
|> Flow.from_enumerable()
|> Flow.flat_map(fn file ->
  File.read(file)
  |> MonEx.flat_map(&Jason.decode/1)
  |> MonEx.map(& &1["artists"])
  |> MonEx.Result.unwrap([])
end)
|> Flow.map(fn artist ->
  :ets.insert(genres, Enum.map(artist["genres"], & {String.trim(&1)}))
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
  :ets.insert(genres, Enum.map(artist["genres"], & {String.trim(&1)}))
end)
|> Flow.run()

# Writing genres into genres.csv
File.mkdir_p!("priv/repo/seeds")
:ets.foldl(fn {el}, acc -> [el | acc] end, [], genres)
|> Enum.with_index(1)
|> Stream.map(& %{id: elem(&1, 1), name: elem(&1, 0)})
|> CSV.encode(headers: true)
|> Stream.into(File.stream!("priv/repo/seeds/genres.csv"))
|> Stream.run()
