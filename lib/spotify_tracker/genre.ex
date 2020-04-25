defmodule SpotifyTracker.Genre do
  use Ecto.Schema
  alias SpotifyTracker.Artist

  schema "genres" do
    field :name, :string

    many_to_many :artists, Artist, join_through: "artist_genres"
  end
end
