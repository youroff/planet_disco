import React, { useState } from 'react'
import { Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const TOP_ARTISTS = gql`query TopArtists($cityId: ID, $cursor: String) {
  artists(byCity: $cityId, cursor: $cursor, limit: 20, sortBy: "listeners") {
    entries {
      name
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
    overflow: "scroll",
    height: "500px" // TODO: compute? refresh on resize?
  }
}))

export default ({city}) => {
  const classes = useStyles()
  
  const variables = {cityId: city.id}
  const { loading, data, fetchMore } = useQuery(TOP_ARTISTS, {variables})
  //  onScroll={console.log}
  return <List className={classes.root}>
    {data && data.artists.entries.map((artist, i) => (
      <ListItem key={i} alignItems="flex-start">
        {artist.images[0] && <ListItemAvatar>
          <Avatar alt={artist.name} src={artist.images[0].path} />
        </ListItemAvatar>}
        <ListItemText
          primary={artist.name}
          secondary={artist.genres.map(g => g.name).join(', ')}
        />
      </ListItem>
    ))}
    <Divider variant="inset" component="li" />
  </List>
}