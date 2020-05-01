defmodule SpotifyTrackerWeb.Types.Location do
  use Absinthe.Schema.Notation
  alias Absinthe.Blueprint.Input.String

  scalar :location, name: "Location" do
    description "GeoLocation - {lng: x, lat: y}"
    parse fn input ->
      with %String{value: val} <- input,
           %{"lng" => x, "lat" => y} <- Jason.decode(val)
      do
        {:ok, %Geo.Point{coordinates: {x, y}, srid: 4326}}
      else
        _ -> :error
      end
    end

    serialize fn
      %Geo.Point{coordinates: {lng, lat}, srid: 4326} -> %{lng: lng, lat: lat}
      _ -> :error
    end
  end
end
