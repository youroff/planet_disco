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


artists1 = Path.wildcard(import_dir <> "/artists/**/*.json")
|> Flow.from_enumerable()
|> Flow.flat_map(fn file ->
  File.read(file)
  |> MonEx.flat_map(&Jason.decode/1)
  |> MonEx.map(& &1["artists"])
  |> MonEx.Result.unwrap([])
end)
|> Flow.map(& &1["id"])
|> Enum.into(MapSet.new())

artists2 = Path.wildcard(import_dir <> "/seed/*.json")
|> Flow.from_enumerable()
|> Flow.flat_map(fn file ->
  File.read(file)
  |> MonEx.flat_map(&Jason.decode/1)
  |> MonEx.map(& &1["artists"]["items"])
  |> MonEx.Result.unwrap([])
end)
|> Flow.map(& &1["id"])
|> Enum.into(MapSet.new())



# Processing actual artists
existing = Path.wildcard(import_dir <> "/cities/**/*.json")
|> Flow.from_enumerable()
|> Flow.map(&Path.basename(&1, ".json"))
|> Enum.into(MapSet.new())
# |> IO.inspect()

# IO.inspect(MapSet.size(existing))

MapSet.difference(MapSet.union(artists1, artists2), existing)
|> MapSet.to_list()
|> Stream.map(&[&1])
|> CSV.encode(headers: false)
|> Stream.into(File.stream!("priv/missing_artists.csv"))
|> Stream.run()
