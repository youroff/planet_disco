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
    |> sort_cities(args)
    |> Repo.paginate(cursor(args))
    |> ok()
  end

  defp sort_cities(q, %{q: term}) when not is_nil(term) do
    order_by(q, [p], desc: fragment("similarity(?, ?)", ^term, p.city), desc: :id)
  end

  defp sort_cities(q, _) do
    order_by(q, [:city, :id])
  end

  defp cursor(args) do
    Map.take(args, [:cursor, :limit])
    |> Map.put(:max_limit, 5000)
  end
end
