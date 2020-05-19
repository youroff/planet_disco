import React, { useEffect, useContext } from 'react'
import { Typography, Chip, LinearProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { StoreContext } from '../store'
import { schemeCategory10 as colorSet } from 'd3-scale-chromatic'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const MASTER_GENRES = gql`query {
  masterGenres {
    id
    name
  }
}`

const genreLimit = 10

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: theme.spacing(2)
  },
  genreButton: {
    marginRight: '3px',
    marginBottom: '3px'
  }
}))

let palette = [...colorSet]

export default () => {
  const classes = useStyles()
  const { loading, data } = useQuery(MASTER_GENRES)
  const { state: { genres, colorMap }, dispatch } = useContext(StoreContext)

  useEffect(() => {
    if (genres.size == 0) palette = [...colorSet]
  }, [genres])

  const toggle = (genre) => {
    if (genres.has(genre)) {
      genres.delete(genre)
      palette.push(colorMap[genre.id])
      dispatch({
        type: 'SET_GENRES',
        genres: new Set(genres),
        colorMap: {...colorMap, [genre.id]: undefined}
      })
    } else if (genres.size < genreLimit) {
      dispatch({
        type: 'SET_GENRES',
        genres: new Set(genres.add(genre)),
        colorMap: {...colorMap, [genre.id]: palette.shift()}
      })
    }
  }

  return <>
    <Typography variant="subtitle1" className={classes.header}>
      Genre popularity
    </Typography>

    <Typography variant="caption" gutterBottom>
      Pick up to {genreLimit} genres to see their popularity worldwide
    </Typography>

    {loading && <LinearProgress />}
    <div>
      {data && data.masterGenres.map((genre, i) => <Chip
        key={i}
        size="small"
        variant="outlined"
        onClick={(genres.size < genreLimit || colorMap[genre.id]) && (() => toggle(genre))}
        style={{backgroundColor: colorMap[genre.id]}}
        className={classes.genreButton}
        label={genre.name}
      />)}
    </div>
  </>
}