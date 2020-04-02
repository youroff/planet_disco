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

File.mkdir_p!(import_dir <> "flat_cities")
Path.wildcard(import_dir <> "/cities/**/*.json")
|> Enum.each(fn file ->
  File.rename(file, import_dir <> "/flat_cities/" <> Path.basename(file, ".json") <> ".json")
end)
