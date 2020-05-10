defmodule SpotifyTrackerWeb.Schema do
  use Absinthe.Schema
  import Absinthe.Resolution.Helpers
  alias SpotifyTracker.Context
  alias SpotifyTrackerWeb.Resolvers
  import SpotifyTrackerWeb, only: [paginated: 1]

  import_types SpotifyTrackerWeb.Types.Location

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

    # many_to_many :artists, Artist, join_through: "artist_cities"
  end
  paginated(:city)

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


    # Fields go here
  end

  def context(ctx) do
    Map.put(ctx, :loader, Dataloader.add_source(Dataloader.new, Context, Context.data()))
  end

  def plugins do
    [Absinthe.Middleware.Dataloader | Absinthe.Plugin.defaults]
  end
end
