# Script for converting source data into collection of CSV files
# for direct DB uplodad (seed.exs):
#
#     mix run priv/repo/importer.exs source_dir

# Caching genres
genres_cache = File.stream!("priv/repo/seeds/genres.csv")
|> CSV.decode(headers: true)
|> Stream.filter(&MonEx.Result.is_ok/1)
|> Stream.map(&MonEx.Result.unwrap/1)
|> Stream.map(& {&1["name"], &1["id"]})
|> Enum.into(%{})

File.mkdir_p!("priv/repo/seeds")

File.stream!("priv/repo/seeds/genre_clusters_source.csv")
|> CSV.decode(headers: true)
|> Stream.filter(&MonEx.Result.is_ok/1)
|> Stream.map(&MonEx.Result.unwrap/1)
|> Stream.map(fn g ->
  %{
    genre_id: Map.get(genres_cache, g["name"]),
    master_genre_id: Map.get(genres_cache, g["parent_name"]),
    coord: "Point Z (#{g["x"]} #{g["y"]} #{g["z"]})",
    pagerank: g["pagerank"]
  }
end)
|> CSV.encode(headers: [:genre_id, :master_genre_id, :coord, :pagerank])
|> Stream.into(File.stream!("priv/repo/seeds/genre_clusters.csv"))
|> Stream.run()
