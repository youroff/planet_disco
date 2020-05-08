import React, { useState, Fragment, useEffect } from 'react'
import { Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

import ArtistPlayer from './artist_player'

const TOP_ARTISTS = gql`query TopArtists($cityId: ID, $cursor: String, $sort: String, $minListeners: Int) {
  artists(byCity: $cityId, cursor: $cursor, limit: 20, sortBy: $sort, minListeners: $minListeners) {
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
  },
  formControl: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
  },
  controlItem: {
    flex: '1 1 auto',
    margin: theme.spacing(1),
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
let lastSort = 'score'

export default ({ city }) => {
  const classes = useStyles()

  const [sortBy, setSortBy] = useState(lastSort);
  const [minListeners, setMinListeners] = useState(100)

  const variables = { cityId: city.id, sort: sortBy, minListeners: minListeners }
  const { loading, data, fetchMore } = useQuery(TOP_ARTISTS, { variables, fetchPolicy: "cache-and-network" })
  const [artistIdx, setArtistIdx] = useState(0)

  useEffect(() => setArtistIdx(0), [city, sortBy])

  const handleSortUpdate = (event) => {
    lastSort = event.target.value
    setSortBy(lastSort);
  };

  const handleMinListenersUpdate = (event) => {
    let val = event.target.value
    if (val != "")
      setMinListeners(+val);
  };

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
    else
      setArtistIdx(-1)
  }

  return (
    <Fragment>
      <form className={classes.formControl}>
        <FormControl className={classes.controlItem} >
          <InputLabel shrink>
            Sort by
          </InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortUpdate}
            displayEmpty
          >
            <MenuItem value={"listeners"}>Absolute listeners</MenuItem>
            <MenuItem value={"score"}>Z-score</MenuItem>
          </Select>
        </FormControl>
        <TextField className={classes.controlItem} id="standard-helperText" label="Min listeners" value={minListeners} onChange={handleMinListenersUpdate} />
      </form>

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