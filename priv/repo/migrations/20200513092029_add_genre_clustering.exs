defmodule SpotifyTracker.Repo.Migrations.AddGenreClustering do
  use Ecto.Migration

  def change do
    create table(:genre_clusters, primary_key: false) do
      add :genre_id, references(:genres, on_delete: :delete_all), null: false
      add :master_genre_id, references(:genres, on_delete: :delete_all), null: false
      add :coord, :geometry, null: false
      add :pagerank, :float, null: false
    end

    create index(:genre_clusters, [:coord],
      name: :genre_clusters_geo_index,
      using: "GIST"
    )

    execute(
      "CREATE MATERIALIZED VIEW city_genre_listeners AS
        SELECT gc.master_genre_id genre_id, ac.city_id, SUM(ac.listeners) listeners FROM artist_genres ag
        INNER JOIN genre_clusters gc ON ag.genre_id = gc.genre_id
        INNER JOIN artist_cities ac ON ag.artist_id = ac.artist_id
        GROUP BY gc.master_genre_id, ac.city_id",
      "DROP MATERIALIZED VIEW city_genre_listeners"
    )
  end
end
