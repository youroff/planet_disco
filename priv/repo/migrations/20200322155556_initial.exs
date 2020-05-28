defmodule SpotifyTracker.Repo.Migrations.Initial do
  use Ecto.Migration

  def change do
    execute("CREATE EXTENSION IF NOT EXISTS \"postgis\"", "DROP EXTENSION \"postgis\"")

    create table("artists") do
      add :name,        :string, null: false
      add :spotify_id,  :string, null: false
      add :bio,         :text
      add :popularity,  :integer, null: false
      add :followers,   :integer, null: false
      add :monthly_listeners, :integer
    end
    create unique_index(:artists, :spotify_id)

    create table("tracks") do
      add :spotify_id,  :string, null: false
      add :name,        :text, null: false
      add :url,         :string, null: false
    end
    create index(:tracks, :spotify_id)

    create table("images") do
      add :path, :string, null: false
      add :width, :integer, null: false
      add :height, :integer, null: false
      add :artist_id, references(:artists, on_delete: :delete_all)
    end

    create table("genres") do
      add :name, :string, null: false
    end
    create unique_index(:genres, [:name])

    create table(:artist_genres, primary_key: false) do
      add :artist_id, references(:artists, on_delete: :delete_all), primary_key: true
      add :genre_id, references(:genres, on_delete: :delete_all), primary_key: true
    end
    create unique_index(:artist_genres, [:artist_id, :genre_id])

    create table("cities") do
      add :city,        :string, null: false
      add :region,      :string
      add :country,     :string, null: false
      add :human_region, :string
      add :human_country, :string, null: false
      add :population, :integer
      add :geohash, :float
    end

    execute("SELECT AddGeometryColumn ('cities','coord',4326,'POINT',2);", "")
    create index("cities", [:coord],
      name: :providers_geo_index,
      using: "GIST"
    )

    execute("SELECT AddGeometryColumn ('cities','em_coord',4326,'POINT',2);", "")
    create index("cities", [:em_coord],
      name: :providers_em_index,
      using: "GIST"
    )

    create table(:artist_cities, primary_key: false) do
      add :artist_id, references(:artists, on_delete: :delete_all), primary_key: true
      add :city_id, references(:cities, on_delete: :delete_all), primary_key: true
      add :listeners, :integer
      add :score, :float
    end
    create unique_index(:artist_cities, [:artist_id, :city_id])
  end
end
