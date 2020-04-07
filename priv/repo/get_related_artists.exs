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

Path.wildcard(import_dir <> "/artists/**/*.json")
|> Flow.from_enumerable
|> Flow.flat_map(fn file ->
  artist_id = String.split(file, "/") 
    |> List.last |> String.replace_suffix(".json", "")
  File.read(file)
  |> MonEx.flat_map(&Jason.decode/1)
  |> MonEx.map(& &1["artists"])
  |> MonEx.Result.unwrap([])
  |> Enum.map(& %{artist_id: artist_id, related: &1["id"]})
end)
|> CSV.encode(headers: true)
|> Stream.into(File.stream!("priv/repo/seeds/related_artists.csv"))
|> Stream.run()
