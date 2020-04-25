defmodule SpotifyTrackerWeb.Router do
  use SpotifyTrackerWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api" do
    pipe_through :api

    forward "/playground", Absinthe.Plug.GraphiQL,
      schema: SpotifyTrackerWeb.Schema,
      interface: :playground

    forward "/", Absinthe.Plug,
      socket: SpotifyTrackerWeb.UserSocket,
      schema: SpotifyTrackerWeb.Schema
  end

  scope "/", SpotifyTrackerWeb do
    pipe_through :browser

    get "/*path", PageController, :index
  end
end
