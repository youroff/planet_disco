defmodule SpotifyTrackerWeb.Resolvers do
  import MonEx.{Result, Option}
  alias SpotifyTracker.{Repo, Artist, City}
  import Ecto.Query


  def get_artists(_, args, _) do
    Artist
    |> order_by([:name, :id])
    |> Repo.paginate(cursor(args))
    |> ok()
  end

  def get_cities(_, args, _) do
    City
    |> order_by([:city, :id])
    |> Repo.paginate(cursor(args))
    |> ok()
  end


  defp cursor(args) do
    Map.take(args, [:cursor, :limit])
    |> Map.put(:max_limit, 5000)
  end
end
