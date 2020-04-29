defmodule SpotifyTrackerWeb.Types.Location do
  use Absinthe.Schema.Notation
  alias Absinthe.Blueprint.Input.String

  scalar :location, name: "Location" do
    description "GeoLocation - Point(Lng, Lat)"
    parse fn input ->
      with %String{value: val} <- input,
           %{"lng" => x, "lat" => y} <- Regex.named_captures(~r/^Point\((?<lng>.*),(?<lat>.*)\)$/, val),
           {lng, ""} <- Float.parse(x),
           {lat, ""} <- Float.parse(y)
      do
        {:ok, %Geo.Point{coordinates: {lng, lat}, srid: 4326}}
      else
        _ -> :error
      end
    end

    serialize fn
      %Geo.Point{coordinates: {lng, lat}, srid: 4326} ->
        "Point(#{lng},#{lat})"
      _ -> :error
    end
  end
end
