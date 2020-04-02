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

# Caching cities
cities = File.stream!("priv/repo/seeds/cities.csv")
|> CSV.decode(headers: true)
|> Stream.filter(&MonEx.Result.is_ok/1)
|> Stream.map(&MonEx.Result.unwrap/1)
|> Stream.map(& {{&1["country"], &1["region"], &1["city"]}, &1["id"]})
|> Enum.into(%{})

# Caching artists
artists = File.stream!("priv/repo/seeds/artists.csv")
|> CSV.decode(headers: true)
|> Stream.filter(&MonEx.Result.is_ok/1)
|> Stream.map(&MonEx.Result.unwrap/1)
|> Stream.map(& {&1["spotify_id"], &1["id"]})
|> Enum.into(%{})

# Processing actual artists
Path.wildcard(import_dir <> "/cities/**/*.json")
|> Flow.from_enumerable()
|> Flow.flat_map(fn file ->
  File.read(file)
  |> MonEx.flat_map(&Jason.decode/1)
  |> MonEx.map(fn artist ->
    artist_id = Path.basename(file, ".json")
    Enum.group_by(artist["artistInsights"]["cities"] || [], fn
      %{"country" => "HK"} -> {"HK", "", "Hong Kong"}
      %{"country" => "SG"} -> {"SG", "", "Singapore"}
      %{"country" => c, "region" => r, "city" => ct} -> {c, r, ct}
    end, & &1["listeners"])
    |> Enum.map(fn {city_id, ls} -> %{
      artist_id: Map.get(artists, artist_id),
      listeners: Enum.sum(ls),
      city_id: Map.get(cities, city_id)
    } end)
    |> Enum.filter(& &1.city_id && &1.artist_id)
  end)
  |> MonEx.Result.unwrap([])
end)
|> CSV.encode(headers: true)
|> Stream.into(File.stream!("priv/repo/seeds/artist_cities.csv"))
|> Stream.run()
