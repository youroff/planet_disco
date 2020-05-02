defmodule SpotifyTracker.Repo.Migrations.AddingFtsIndex do
  use Ecto.Migration

  def change do
    execute("CREATE EXTENSION IF NOT EXISTS \"pg_trgm\"", "DROP EXTENSION \"pg_trgm\"")
    execute("CREATE EXTENSION IF NOT EXISTS \"btree_gist\"", "DROP EXTENSION \"btree_gist\"")
    create index("cities", [:city], name: :cities_trgm_index, using: "GIST")
    create index("artists", [:name], name: :artists_trgm_index, using: "GIST")
    create index("genres", [:name], name: :genres_trgm_index, using: "GIST")
  end
end
