import React, { Fragment } from 'react'
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Skeleton } from '@material-ui/lab'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { processScroll } from './utils'
import invariant from 'invariant'

const TOP_ARTISTS = gql`query TopArtists($byType: String!, $byId: ID!, $cursor: String) {
  topArtists(byType: $byType, byId: $byId, cursor: $cursor, limit: 20) {
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
    overflowY: "scroll",
    scrollBehavior: "smooth",
    height: "100%",
    '& li:last-child': {
      display: 'none'
    }
  }
}))

export default ({ city, genre }) => {
  invariant(!!city ^ !!genre, 'Either city or genre should be passed into TopArtists component')
  const classes = useStyles()

  const variables = city ? { byType: 'city', byId: city.id } : { byType: 'genre', byId: genre.genreId }
  const { loading, data, fetchMore } = useQuery(TOP_ARTISTS, {variables, fetchPolicy: "cache-and-network"})

  return <List
    className={classes.root}
    onScroll={processScroll(variables, 600, 'topArtists', { loading, data, fetchMore })}
  >
    {data && data.topArtists.entries.map((artist, i) => (<Fragment key={i}>
      <ListItem alignItems="flex-start">
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

    {loading && new Array(20).fill(0).map((_, i) => (<Fragment key={i}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Skeleton variant="circle" animation="wave" height={40} width={40} />
        </ListItemAvatar>
        <ListItemText
          primary={<Skeleton variant="rect" animation="wave" height={45} width={"100%"} />}
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </Fragment>))}
  </List>
}