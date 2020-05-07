defmodule SpotifyTracker.Repo.Migrations.AddRelatedArtists do
  use Ecto.Migration

  def change do
    create table("related_artists") do
     add :artist_spot_id, :string, null: false
     add :related_spot_id, :string, null: false
    end
  end
end
