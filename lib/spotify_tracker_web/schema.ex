defmodule SpotifyTrackerWeb.Schema do
  use Absinthe.Schema
  import Absinthe.Resolution.Helpers
  alias SpotifyTracker.Context
  alias SpotifyTrackerWeb.Resolvers
  import SpotifyTrackerWeb, only: [paginated: 1]

  import_types SpotifyTrackerWeb.Types.Location
  import_types SpotifyTrackerWeb.Types.Coordinate

  object :artist do
    field :id, :id
    field :name, non_null(:string)
    field :spotify_id, non_null(:string)
    field :bio, :string
    field :popularity, non_null(:integer)
    field :followers, non_null(:integer)
    field :monthly_listeners, non_null(:integer)

    field :images, non_null(list_of(non_null(:image))) do
      arg :height, :integer
      arg :width, :integer
      resolve dataloader(Context)
    end
    field :genres, non_null(list_of(non_null(:genre))), resolve: dataloader(Context)
  end
  paginated(:artist)

  object :genre do
    field :id, :id
    field :name, non_null(:string)
  end
  paginated(:genre)

  object :clustered_genre do
    field :genre_id, :id
    field :name, non_null(:string)
    field :coord, :coordinate
    field :pagerank, :float
    field :master_genre_id, :id
  end

  object :image do
    field :id, :id
    field :path, :string
    field :width, :integer
    field :height, :integer
  end

  object :city do
    field :id, :id
    field :city,          non_null(:string)
    field :region,        :string
    field :country,       non_null(:string)
    field :human_region,  non_null(:string)
    field :human_country, non_null(:string)
    field :population,    non_null(:integer)
    field :coord,         non_null(:location)
    field :em_coord,      :location
    field :geohash,       :float

    field :similarity,    :float
    # many_to_many :artists, Artist, join_through: "artist_cities"
  end
  paginated(:city)

  object :city_genre do
    field :city_id, :id
    field :genre_id, :id
    field :popularity, :float
  end

  object :track do
    field :spotify_id, :string
    field :name, :string
    field :url, :string
  end

  query do
    @desc "Artists entry point, returns list of artists"
    field :artists, :paginated_artist do
      arg :cursor, :string
      arg :limit, :integer
      arg :by_city, :id
      arg :sort_by, :string
      arg :min_listeners, :integer
      resolve &Resolvers.get_artists/3
    end

    @desc "Top artists by city or genre"
    field :top_artists, :paginated_artist do
      arg :cursor, :string
      arg :limit, :integer
      arg :by_type, non_null(:string)
      arg :by_id, non_null(:id)
      resolve &Resolvers.get_top_artists/3
    end

    @desc "Demo tracks"
    field :tracks, non_null(list_of(non_null(:track))) do
      arg :spotify_id, :string
      resolve &Resolvers.get_tracks/3
    end

    @desc "Cities entry point, returns list of cities"
    field :cities, :paginated_city do
      arg :cursor, :string
      arg :limit, :integer
      arg :q, :string
      arg :by_id, :string
      arg :has_embedding, :boolean
      arg :sort_by, :string
      resolve &Resolvers.get_cities/3
    end

    @desc "Genres entry point, returns list of genres"
    field :genres, :paginated_genre do
      arg :cursor, :string
      arg :limit, :integer
      arg :q, :string
      resolve &Resolvers.get_genres/3
    end

    @desc "Master genres — genres that serve as cluster representative"
    field :master_genres, non_null(list_of(non_null(:genre))) do
      resolve &Resolvers.get_master_genres/3
    end

    @desc "List of city ids along with popularity of a given genre normalized by population"
    field :genre_popularity, non_null(list_of(non_null(:city_genre))) do
      arg :genre_id, non_null(:id)
      resolve &Resolvers.get_city_genres/3
    end

    @desc "List of city ids along with popularity of a given genre normalized by population"
    field :genre_popularity_normalized, non_null(list_of(non_null(:city_genre))) do
      arg :genre_ids, non_null(list_of(non_null(:id)))
      resolve &Resolvers.get_city_genres_norm/3
    end

    field :similar_cities, non_null(list_of(non_null(:city))) do
      arg :threshold, non_null(:integer), default_value: 500
      arg :id, non_null(:id)
      resolve &Resolvers.get_similar_cities/3
    end

    field :clustered_genres, non_null(list_of(non_null(:clustered_genre))) do
      resolve &Resolvers.get_clustered_genres/3
    end
  end

  def context(ctx) do
    Map.put(ctx, :loader, Dataloader.add_source(Dataloader.new, Context, Context.data()))
  end

  def plugins do
    [Absinthe.Middleware.Dataloader | Absinthe.Plugin.defaults]
  end
end
