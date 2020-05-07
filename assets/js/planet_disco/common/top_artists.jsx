import React, { useState, Fragment, useEffect } from 'react'
import { Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import ArtistPlayer from './artist_player'

const TOP_ARTISTS = gql`query TopArtists($cityId: ID, $cursor: String) {
  artists(byCity: $cityId, cursor: $cursor, limit: 20, sortBy: "listeners") {
    entries {
      name
      spotifyId
      genres {
        name
      }
      images {
        path
      }
    }
    cursor
  }
}`

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: "scroll",
    scrollBehavior: "smooth",
    height: "100%",
    '& li:last-child': {
      display: 'none'
    }
  }
}))

// This will be abstracted into some generic function later
const updateQuery = (base, { fetchMoreResult }) => {
  if (!fetchMoreResult) return base;
  return Object.assign({}, base, {
    artists: Object.assign({}, base.artists, {
      entries: [...base.artists.entries, ...fetchMoreResult.artists.entries],
      cursor: fetchMoreResult.artists.cursor
    })
  })
}

const trigger = 600

export default ({ city }) => {
  const classes = useStyles()

  const variables = { cityId: city.id }
  const { loading, data, fetchMore } = useQuery(TOP_ARTISTS, { variables, fetchPolicy: "cache-and-network" })
  const [artistIdx, setArtistIdx] = useState(0)

  useEffect(() => setArtistIdx(0), [city])

  const fetchNextArtist = () => {
    if (!data) {
      return
    }

    if (artistIdx < data.artists.entries.length - 1) {
      setArtistIdx(artistIdx + 1)
      return
    }

    if (!loading && data.artists.cursor)
      fetchMore({
        variables: { ...variables, cursor: data.artists.cursor },
        updateQuery
      })
    setArtistIdx(-1)
  }

  return (
    <Fragment>
      <List
        className={classes.root}
        onScroll={(e) => {
          const leftover = e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
          if (leftover < trigger && !loading && data.artists.cursor) {
            fetchMore({
              variables: { ...variables, cursor: data.artists.cursor },
              updateQuery
            })
          }
        }}
      >
        {data && data.artists.entries.map((artist, i) => (<Fragment key={i}>
          <ListItem selected={i == artistIdx} alignItems="flex-start" onClick={() => setArtistIdx(i)}>
            {artist.images[0] && <ListItemAvatar>
              <Avatar alt={artist.name} src={artist.images[0].path} />
            </ListItemAvatar>}
            <ListItemText
              primary={`#${i + 1} ${artist.name}`}
              secondary={artist.genres.map(g => g.name).join(', ')}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </Fragment>))}
      </List>
      <ArtistPlayer currentArtist={(data && artistIdx > -1) ? data.artists.entries[artistIdx] : null} fetchNext={fetchNextArtist} />
    </Fragment>)
}