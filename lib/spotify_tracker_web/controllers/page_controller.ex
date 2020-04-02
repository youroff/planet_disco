defmodule SpotifyTrackerWeb.PageController do
  use SpotifyTrackerWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
