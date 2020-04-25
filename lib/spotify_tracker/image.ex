defmodule SpotifyTracker.Image do
  use Ecto.Schema
  alias SpotifyTracker.Artist

  schema "images" do
    field :path, :string
    field :width, :integer
    field :height, :integer

    belongs_to :artist, Artist
  end
end
