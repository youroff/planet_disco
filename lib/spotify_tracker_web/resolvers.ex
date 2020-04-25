defmodule SpotifyTrackerWeb.Resolvers do
  import MonEx.{Result, Option}
  alias SpotifyTracker.{Repo, Artist}

  def get_artists(_, _, _) do
    ok(Repo.all(Artist))
  end

end
