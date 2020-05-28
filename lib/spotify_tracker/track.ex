defmodule SpotifyTracker.Track do
  use Ecto.Schema

  schema "tracks" do
    field :name,        :string
    field :spotify_id,  :string
    field :url,         :string
  end
end
