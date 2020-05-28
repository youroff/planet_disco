defmodule SpotifyTracker.Repo.Migrations.AddMaterializedViews do
  use Ecto.Migration

  def change do

    execute(
      "CREATE MATERIALIZED VIEW genre_listeners AS
        SELECT g.id genre_id, COALESCE(SUM(listeners), 0) listeners
        FROM genres g
        LEFT JOIN artist_genres ag ON ag.genre_id = g.id
        LEFT JOIN artist_cities ac ON ag.artist_id = ac.artist_id
        GROUP BY g.id",
      "DROP MATERIALIZED VIEW genre_listeners"
    )

    execute(
      "CREATE MATERIALIZED VIEW city_listeners AS
        SELECT c.id city_id, COALESCE(SUM(listeners), 0) listeners
        FROM cities c
        LEFT JOIN artist_cities ac ON ac.city_id = c.id
        GROUP BY c.id",
      "DROP MATERIALIZED VIEW city_listeners"
    )
  end
end
