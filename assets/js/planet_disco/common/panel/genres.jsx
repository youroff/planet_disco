import React, { Fragment, useRef, useEffect } from 'react'
import { List, ListItem, ListItemText, Divider, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import { ChevronRight } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import Skeleton from '@material-ui/lab/Skeleton'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { processScroll } from '../utils'

const GENRES = gql`query Genres($term: String, $cursor: String) {
  genres(q: $term, cursor: $cursor, limit: 40) {
    entries {
      id
      name
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

export default ({ term, selectGenre, selectedGenres, canAddMore }) => {
  const classes = useStyles()
  
  const listRef = useRef()
  const variables = {term}
  const { loading, data, fetchMore } = useQuery(GENRES, {variables, fetchPolicy: "cache-and-network"})

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTo(0, 0)
  }, [listRef, term])

  return <List
    ref={listRef}
    className={classes.root}
    onScroll={processScroll(variables, 600, 'genres', { loading, data, fetchMore })}
  >
    {data && data.genres.entries.filter((g) => !selectedGenres.has(g.id)).map((genre, i) => (<Fragment key={i}>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={genre.name}
        />

        {canAddMore && <ListItemSecondaryAction>
          <IconButton edge="end" onClick={() => selectGenre(genre)}>
            <ChevronRight />
          </IconButton>
        </ListItemSecondaryAction>}
      </ListItem>
      <Divider component="li" />
    </Fragment>))}

    {loading && new Array(40).fill(0).map((_, i) => (<Fragment key={i}>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={<Skeleton variant="rect" animation="wave" height={20} width={"100%"} />}
        />
      </ListItem>
      <Divider component="li" />
    </Fragment>))}
  </List>
}