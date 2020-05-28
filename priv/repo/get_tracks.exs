# Script for converting source data into collection of CSV files
# for direct DB uplodad (seed.exs):
#
#     mix run priv/repo/importer.exs source_dir

# This is a formal check that verifies that given directory exists
# and has 'artists' and 'cities' subdirectories:
# Caching artists
import Meeseeks.XPath
HTTPoison.start

artists = File.stream!("priv/repo/seeds/artists.csv")
|> CSV.decode(headers: true)
|> Stream.filter(&MonEx.Result.is_ok/1)
# |> Stream.take(10)
|> Stream.map(&MonEx.Result.unwrap/1)
|> Stream.flat_map(fn artist ->
  with %HTTPoison.Response{body: body} <- HTTPoison.get!("https://open.spotify.com/embed/artist/" <> artist["spotify_id"]),
    doc <- Meeseeks.parse(body),
    res <- Meeseeks.one(doc, xpath("//*[@id='resource']")),
    {"script", _, [txt]} <- Meeseeks.tree(res),
    {:ok, data} <- Jason.decode(txt)
  do
    data["tracks"]
    |> Enum.filter(& !is_nil(&1["preview_url"]))
    |> Enum.map(fn track ->
      %{
        id: artist["spotify_id"],
        name: track["name"],
        url: track["preview_url"] |> String.split("?") |> List.first()
      }
    end)
  else
    _ -> []
  end
end)
|> CSV.encode(headers: true)
|> Stream.into(File.stream!("priv/repo/seeds/artist_tracks.csv"))
|> Stream.run()
