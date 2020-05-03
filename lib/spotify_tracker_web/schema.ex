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

    # many_to_many :genres, Genre, join_through: "artist_genres"
    # many_to_many :cities, City, join_through: "artist_cities"
    # has_many :images, Image
    field :genres, non_null(list_of(non_null(:genre))),  resolve: dataloader(Context)
  end
  paginated(:artist)

  object :genre do
    field :id, :id
    field :name, non_null(:string)
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

    # many_to_many :artists, Artist, join_through: "artist_cities"
  end
  paginated(:city)

  query do
    @desc "Artists entry point, returns list of artists"
    field :artists, :paginated_artist do
      arg :cursor, :string
      arg :limit, :integer
      arg :by_city, :integer
      arg :sort_by, :string
      resolve &Resolvers.get_artists/3
    end

    @desc "Cities entry point, returns list of cities"
    field :cities, :paginated_city do
      arg :cursor, :string
      arg :limit, :integer
      arg :q, :string
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
