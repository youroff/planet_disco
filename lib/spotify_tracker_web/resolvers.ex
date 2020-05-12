defmodule SpotifyTrackerWeb.Resolvers do
  import MonEx.{Result, Option}
  alias SpotifyTracker.{Repo, Artist, City, CityListener, Genre, ArtistCity}
  import Ecto.Query

  # ARTISTS ENDPOINT
  def get_artists(_, args, _) do
    sort = Map.get(args, :sort_by)
    q = Artist
    |> do_if(sort == "listeners" || sort == "score"  || Map.get(args, :by_city), fn query ->
      join(query, :left, [a], c in "artist_cities", as: :artist_city, on: c.artist_id == a.id)
    end)

    Enum.reduce(args, q, fn
      {:by_city, city_id}, q ->
        where(q, [_, artist_city: ac], ac.city_id == type(^city_id, :integer))
      {:min_listeners, limit}, q ->
        where(q, [_, artist_city: ac], ac.listeners > ^limit)
      _, q -> q
    end)
    |> sort_artists(sort)
    |> Repo.paginate(cursor(args))
    |> ok()
  end

  defp sort_artists(q, "listeners") do
    order_by(q, [_, artist_city: ac], [desc: ac.listeners, desc: :id])
  end

  defp sort_artists(q, "score") do
    order_by(q, [_, artist_city: ac], [desc: ac.score, desc: :id])
  end

  defp sort_artists(q, _) do
    order_by(q, [:name, :id])
  end

  # CITIES ENDPOINT
  def get_cities(_, args, _) do
    City
    |>  do_if(Map.has_key?(args, :by_id), fn q ->
          where(q, [c], c.id == ^args.by_id)
        end)
    |> filter_embedding(args)
    |> sort_cities(args)
    |> Repo.paginate(cursor(args))
    |> ok()
  end

  defp filter_embedding(q, %{has_embedding: true}) do
    where(q, [c], not is_nil(c.em_coord))
  end

  defp filter_embedding(q, _) do
    q
  end

  defp sort_cities(q, %{sort_by: "population"}) do
    order_by(q, desc: :population)
  end

  defp sort_cities(q, %{q: ""}) do
    order_by(q, [:city, :id])
  end

  defp sort_cities(q, %{q: t}) do
    order_by(q, [p], desc: fragment("similarity(?, ?)", ^t, p.city), desc: :id)
  end

  defp sort_cities(q, _) do
    order_by(q, [:city, :id])
  end

  # GENRES
  def get_genres(_, args, _) do
    IO.inspect(args)
    Genre
    |> sort_genres(args)
    |> Repo.paginate(cursor(args))
    |> ok()
  end

  defp sort_genres(q, %{q: ""}) do
    order_by(q, [g], asc: g.name, desc: :id)
  end

  defp sort_genres(q, %{q: t}) do
    order_by(q, [g], desc: fragment("similarity(?, ?)", ^t, g.name), desc: :id)
  end

  defp sort_genres(q, _) do
    order_by(q, [g], asc: g.name, desc: :id)
  end


  # CITY GENRES
  def get_city_genres(_, %{genre_id: genre_id}, _) do
    (from g in Genre,
      join: a in assoc(g, :artists),
      join: ac in ArtistCity, on: ac.artist_id == a.id,
      join: c in City, on: ac.city_id == c.id,
      where: g.id == ^genre_id,
      group_by: c.id,
      select: %{city_id: c.id, popularity: fragment("SUM(?)::float / ?", ac.listeners, c.population)})
    |> Repo.all()
    |> ok()
  end

  def get_city_genres_norm(_, %{genre_ids: genre_ids}, _) do
    (from g in Genre,
      inner_join: a in assoc(g, :artists),
      inner_join: ac in ArtistCity, on: ac.artist_id == a.id,
      inner_join: c in City, on: ac.city_id == c.id,
      inner_join: cl in CityListener, on: cl.city_id == c.id,
      where: g.id in ^genre_ids,
      distinct: c.id,
      group_by: [c.id, g.id, cl.listeners],
      select: %{city_id: c.id, genre_id: g.id, popularity: fragment("SUM(?)::float / ?", ac.listeners, cl.listeners)},
      order_by: [desc: c.id, desc: fragment("SUM(?)", ac.listeners)]
    )
    |> Repo.all()
    |> ok()
  end

  defp cursor(args) do
    Map.take(args, [:cursor, :limit])
    |> Map.put(:max_limit, 5000)
  end

  defp do_if(q, true, f), do: f.(q)
  defp do_if(q, false, f), do: q

  defp not_nulls(args) do
    Enum.filter(args, &!is_nil(elem(&1, 1)))
  end
end
