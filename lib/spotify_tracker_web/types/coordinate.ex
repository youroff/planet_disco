defmodule SpotifyTrackerWeb.Types.Coordinate do
  use Absinthe.Schema.Notation
  alias Absinthe.Blueprint.Input.String

  scalar :coordinate, name: "Coordinate" do
    description "Geometry coordinate - {x: x, y: y, z: z}"
    parse fn input ->
      with %String{value: val} <- input,
           %{"x" => x, "y" => y, "z" => z} <- Jason.decode(val)
      do
        {:ok, %Geo.PointZ{coordinates: {x, y, z}}}
      else
        _ -> :error
      end
    end

    serialize fn
      %Geo.PointZ{coordinates: {x, y, z}} -> %{x: x, y: y, z: z}
      _ -> :error
    end
  end
end
