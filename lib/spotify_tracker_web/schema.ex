defmodule SpotifyTrackerWeb.Schema do
  use Absinthe.Schema
  import Absinthe.Resolution.Helpers
  alias SpotifyTracker.Context
  alias SpotifyTrackerWeb.Resolvers

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

  object :genre do
    field :id, :id
    field :name, non_null(:string)
  end


  query do
    @desc "Artists entry point, returns list of artists"
    field :artists, list_of(:artist) do
      # arg :event_ids, list_of(:id)
      # arg :cursor, :cursor_input
      resolve &Resolvers.get_artists/3
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
