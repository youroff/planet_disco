defmodule SpotifyTracker.Artist do
  use Ecto.Schema
  alias SpotifyTracker.{Genre, City, Image}

  schema "artists" do
    field :name,        :string
    field :spotify_id,  :string
    field :bio,         :string
    field :popularity,  :integer
    field :followers,   :integer
    field :monthly_listeners, :integer

    many_to_many :genres, Genre, join_through: "artist_genres"
    many_to_many :cities, City, join_through: "artist_cities"
    has_many :images, Image
  end
end
