import React, { useState, useEffect, useContext } from 'react'
import { Typography, TextField, Chip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Genres from './genres'
import { StoreContext } from '../store'
import { schemeCategory10 as colorScheme } from 'd3-scale-chromatic'
import { useApolloClient } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { max } from 'd3'

const CITY_GENRES = gql`query CityGenres($genreIds: [ID]) {
  genrePopularityNormalized(genreIds: $genreIds) {
    cityId
    genreId
    popularity
  }
}`

const genreLimit = 10

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: theme.spacing(2)
  },
  search: {
    marginBottom: theme.spacing(2)
  }
}))

export default () => {
  const classes = useStyles()
  const graphql = useApolloClient()

  const [term, setTerm] = useState("")
  const [selectedGenres, setSelectedGenres] = useState([])
  const { state, dispatch } = useContext(StoreContext)

  useEffect(() => {
    const genreIds = selectedGenres.map(g => g.id)
    const colorMap = {}
    genreIds.forEach((id, i) => { colorMap[id] = colorScheme[i] })

    graphql.query({
      query: CITY_GENRES,
      variables: { genreIds }
    }).then(({ data }) => {
      const cityMap = {}
      const top = max(data.genrePopularityNormalized.map(g => g.popularity))
      data.genrePopularityNormalized.forEach(({ cityId, genreId, popularity }) => {
        cityMap[cityId] = [colorMap[genreId], popularity / top]
      })
      state.genreHandler && state.genreHandler(cityMap)
    })
  }, [selectedGenres])

  const addGenre = (genre) =>
    setSelectedGenres(selectedGenres.concat(genre))

  const removeGenre = (genre) =>
    setSelectedGenres(selectedGenres.filter(g => g.id != genre.id))

  return <>
    <Typography variant="subtitle1" className={classes.header}>
      Genre popularity
    </Typography>

    <Typography variant="caption" gutterBottom>
      Pick up to {genreLimit} genres to see their popularity worldwide
    </Typography>

    <TextField
      className={classes.search}
      label="Find genre"
      onChange={(e) => setTerm(e.target.value)}
    />

    <div>
      {selectedGenres.map((genre, i) => <Chip
        key={i}
        style={{
          backgroundColor: colorScheme[i],
          marginRight: '3px',
          marginBottom: '3px'
        }}
        label={genre.name}
        onDelete={() => removeGenre(genre)}
      />)}
    </div>

    <Genres
      term={term}
      selectGenre={addGenre}
      selectedGenres={new Set(selectedGenres.map(g => g.id))}
      canAddMore={selectedGenres.length < genreLimit}
    />
  </>
}