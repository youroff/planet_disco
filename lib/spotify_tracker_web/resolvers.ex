defmodule SpotifyTrackerWeb.Resolvers do
  import MonEx.{Result, Option}
  import Geo.PostGIS
  alias SpotifyTracker.{
    Repo, Artist, City, CityListener, Genre, ArtistCity,
    GenreListener, GenreCluster, CityGenreListener
  }
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

    # ARTISTS ENDPOINT
    def get_top_artists(_, %{by_type: type, by_id: id} = args, _) do
      case type do
        "city" -> from a in Artist,
          join: ac in "artist_cities", on: a.id == ac.artist_id,
          where: ac.city_id == type(^id, :integer),
          order_by: [desc: ac.score, desc: a.id]
        "genre" -> from a in Artist,
          left_join: ag in "artist_genres", on: a.id == ag.artist_id,
          where: ag.genre_id == type(^id, :integer),
          order_by: [desc: a.popularity, desc: a.id]
      end
      |> Repo.paginate(cursor(args))
      |> ok()
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

  # MASTER GENRES
  def get_master_genres(_, _, _) do
    # # BY SUM OF LISTENERS
    # query = from gc in GenreCluster,
    #   join: gl in GenreListener, on: gc.genre_id == gl.genre_id,
    #   join: g in assoc(gc, :master_genre),
    #   group_by: g.id,
    #   order_by: [desc: sum(gl.listeners)],
    #   select: g

    # # BY CLUSTER SIZE / PAGERANK
    # query = from gc in GenreCluster,
    #   # join: gl in GenreListener, on: gc.genre_id == gl.genre_id,
    #   join: g in assoc(gc, :master_genre),
    #   group_by: g.id,
    #   # order_by: [desc: count(g.id)],
    #   order_by: [desc: max(gc.pagerank)],
    #   select: g

    # BY PAGERANK
    query = from gc in GenreCluster,
      # join: gl in GenreListener, on: gc.genre_id == gl.genre_id,
      join: g in assoc(gc, :master_genre),
      where: gc.genre_id == gc.master_genre_id,
      order_by: [desc: gc.pagerank],
      select: g

    Repo.all(query) |> ok()
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
    (from g in CityGenreListener,
      inner_join: cl in CityListener, on: cl.city_id == g.city_id,
      where: g.genre_id in ^genre_ids,
      distinct: g.city_id,
      select: %{
        city_id: g.city_id,
        genre_id: g.genre_id,
        popularity: type(g.listeners, :float) / cl.listeners
      },
      order_by: [desc: g.city_id, desc: g.listeners]
    )
    |> Repo.all()
    |> ok()
  end

  def get_similar_cities(_, %{id: city_id, threshold: t}, _) do
    city = Repo.get_by(City, id: city_id)

    (from c in City,
      where: st_distance_in_meters(c.coord, ^city.coord) > ^(t * 1000)
        and st_distance(c.em_coord, ^city.em_coord) < 1.0,
      order_by: [asc: st_distance(c.em_coord, ^city.em_coord)],
      select_merge: %{c | similarity: st_distance(c.em_coord, ^city.em_coord)}
    )
    |> Repo.all()
    |> ok()
  end

  def get_clustered_genres(_, _, _) do
    (from gc in GenreCluster,
      join: g in assoc(gc, :genre),
      select_merge: %{gc | name: g.name}
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
end
