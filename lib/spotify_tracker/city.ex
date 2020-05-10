defmodule SpotifyTracker.City do
  use Ecto.Schema

  schema "cities" do
    field :city,          :string
    field :region,        :string
    field :country,       :string
    field :human_region,  :string
    field :human_country, :string
    field :population,    :integer
    field :coord,         Geo.PostGIS.Geometry
    field :em_coord,      Geo.PostGIS.Geometry
    field :geohash,       :float

    many_to_many :artists, Artist, join_through: "artist_cities"
  end
end
