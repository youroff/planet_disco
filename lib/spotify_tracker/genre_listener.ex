defmodule SpotifyTracker.GenreListener do
  use Ecto.Schema
  alias SpotifyTracker.{Genre}

  schema "genre_listeners" do
    field :listeners, :integer
    belongs_to :genre, Genre
  end
end
