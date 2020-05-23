import React, { useState } from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { schemeCategory10 as colorSet } from 'd3-scale-chromatic'
import GenreSelector from '../common/panel/genre_selector'

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: theme.spacing(2)
  }
}))

export default ({ genreColors, setGenreColors }) => {
  const classes = useStyles()
  const [palette, updatePalette] = useState(
    colorSet.filter(c => !Object.values(genreColors).includes(c))
  )

  const addGenre = (genre) => {
    setGenreColors({ ...genreColors, [genre.id]: palette.shift() })
    updatePalette([...palette])
  }

  const removeGenre = (genre) => {
    updatePalette([genreColors[genre.id], ...palette])
    const { [genre.id]: _, ...gc } = genreColors
    setGenreColors(gc)
  }

  return <>
    <Typography variant="subtitle1">
      Genre popularity
    </Typography>

    <Typography variant="caption" className={classes.header}>
      Pick up to {colorSet.length} genres to see their popularity worldwide
    </Typography>

    <GenreSelector colorMap={genreColors} selectGenre={(g) => {
      if (genreColors[g.id]) {
        removeGenre(g)
      } else if (palette.length > 0) {
        addGenre(g)
      }
    }} />
  </>
}
