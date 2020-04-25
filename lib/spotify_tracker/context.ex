defmodule SpotifyTracker.Context do
  alias SpotifyTracker.Repo

  def data() do
    Dataloader.Ecto.new(Repo, query: &dataloader_query/2)
  end

  def dataloader_query(q, _) do
    q
  end

end
