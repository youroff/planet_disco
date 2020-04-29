defmodule SpotifyTracker.Repo do
  use Ecto.Repo,
    otp_app: :spotify_tracker,
    adapter: Ecto.Adapters.Postgres
  use EctoCursor
end


Postgrex.Types.define(SpotifyTracker.PostgresTypes,
  [Geo.PostGIS.Extension] ++ Ecto.Adapters.Postgres.extensions(), json: Jason)
