defmodule SpotifyTrackerWeb.Resolvers do
  import MonEx.{Result, Option}
  alias SpotifyTracker.{Repo, Artist, City}
  import Ecto.Query

  def get_artists(_, args, _) do
    Artist
    |> order_by([:name, :id])
    |> Repo.paginate(Map.take(args, [:cursor, :limit]))
    |> ok()
  end

  def get_cities(_, args, _) do
    City
    |> order_by([:city, :id])
    |> Repo.paginate(Map.take(args, [:cursor, :limit]))
    |> ok()
  end
end
