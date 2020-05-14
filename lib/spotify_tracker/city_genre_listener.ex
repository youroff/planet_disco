defmodule SpotifyTracker.CityGenreListener do
  use Ecto.Schema
  alias SpotifyTracker.{City, Genre}

  schema "city_genre_listeners" do
    field :listeners, :integer
    belongs_to :genre, Genre
    belongs_to :city, City
  end
end
