# # Script for converting source data into collection of CSV files
# # for direct DB uplodad (seed.exs):
# #
# #     mix run priv/repo/importer.exs source_dir

# # This is a formal check that verifies that given directory exists
# # and has 'artists' and 'cities' subdirectories:
# import_dir = with [dirname] <- System.argv(),
#   {:ok, %File.Stat{type: :directory}} <- File.lstat(dirname),
#   {:ok, %File.Stat{type: :directory}} <- File.lstat(dirname <> "/artists"),
#   {:ok, %File.Stat{type: :directory}} <- File.lstat(dirname <> "/cities")
# do
#   dirname
# else
#   _ -> exit("Import dir structure is invalid")
# end

# # Dictionary of country-region codes: "CTR-REG" -> Human readable region
# # iso3166 = File.stream!(import_dir <> "/iso3166-2.csv")
# # |> CSV.decode()
# # |> Stream.filter(&MonEx.Result.is_ok/1)
# # |> Stream.map(&MonEx.Result.unwrap/1)
# # |> Enum.into(%{}, fn [code, reg] -> {code, reg} end)
# File.mkdir_p!("priv/repo/seeds")
# cities = Path.wildcard(import_dir <> "/cities/**/*.json")
# # |> Enum.take(100)
# |> Flow.from_enumerable()
# |> Flow.flat_map(fn file ->
#   File.read(file)
#   |> MonEx.flat_map(&Jason.decode/1)
#   |> MonEx.map(& get_in(&1, ["artistInsights", "cities"]) || [])
#   |> MonEx.Result.unwrap([])
# end)
# |> Flow.map(fn city ->
#   Map.take(city, ["city", "country", "region"])
# end)
# |> Flow.uniq()
# |> CSV.encode(headers: true)
# |> Stream.into(File.stream!("priv/repo/seeds/cities.csv"))
# |> Stream.run()
# # |> Enum.to_list()
# # |> Enum.uniq()
# # |> Enum.map(fn city ->
# #   Map.put(city, "hregion", iso3166[city["country"] <> "-" <> city["region"]])
# # end)
# # |> Enum.filter(& is_nil &1["hregion"])
# # IO.inspect(length cities)

# # cities
# # |> Enum.map(& {&1["country"], &1["region"], &1["city"]})
# # |> Enum.uniq()
# # |> IO.inspect(limit: :infinity)
#   #   :ets.insert(genres, Enum.map(artist["genres"], & {&1}))

# #   :ets.insert_new(artists, {artist["id"], %{
# #     name: artist["name"],
# #     followers: artist["followers"]["total"],
# #     popularity: artist["popularity"],
# #     images: artist["images"]
# #   }})
# # end)
# # |> Flow.run()

# # unique_genres = :ets.foldl(fn {el}, acc -> [el | acc] end, [], genres)
# # |> Enum.with_index(1)
# # |> Enum.into(%{})

# # # Saving Genres to 'genres.csv'
# # File.mkdir_p!("priv/repo/seeds")
# # unique_genres
# # |> Map.to_list()
# # |> Stream.map(& %{id: elem(&1, 1), name: elem(&1, 0)})
# # |> CSV.encode(headers: true)
# # |> Stream.into(File.stream!("priv/repo/seeds/genres.csv"))
# # |> Stream.run()

# # # unique_genres |> length() |> IO.inspect
# # # unique_genres |> Enum.uniq() |> length() |> IO.inspect
# # # unique_genres |> IO.inspect
# # # IO.inspect(:ets.lookup(artists, :ets.first(artists)))
# # # IO.inspect(:ets.next(artists))
# # # IO.inspect(:ets.next(artists))
