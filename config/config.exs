# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :spotify_tracker,
  ecto_repos: [SpotifyTracker.Repo]

# Configures the endpoint
config :spotify_tracker, SpotifyTrackerWeb.Endpoint,
  http: [ip: {0, 0, 0, 0}, port: 4000],
  url: [host: "localhost"],
  secret_key_base: "qg7vahrUz7BojG/m024ZXGFBYE8t8EpgW1YZei9XAXiCfTMgOI65sxKfmoR1+a4p",
  render_errors: [view: SpotifyTrackerWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: SpotifyTracker.PubSub, adapter: Phoenix.PubSub.PG2],
  live_view: [signing_salt: "w8T6WJ5i"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :geo_postgis, json_library: Jason
# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
