defmodule SpotifyTracker.GenreCluster do
  use Ecto.Schema
  alias SpotifyTracker.Genre

  @primary_key false

  schema "genre_clusters" do
    field :coord, Geo.PostGIS.Geometry
    field :pagerank, :float
    field :name, :string, virtual: true

    belongs_to :genre, Genre
    belongs_to :master_genre, Genre
  end
end
