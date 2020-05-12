defmodule SpotifyTracker.CityListener do
  use Ecto.Schema
  alias SpotifyTracker.{City}

  schema "city_listeners" do
    field :listeners, :integer
    belongs_to :city, City
  end
end
