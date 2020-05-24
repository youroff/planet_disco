import React from 'react'
import { Chip, LinearProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2)
  },
  genreButton: {
    marginRight: '3px',
    marginBottom: '3px'
  }
}))

export default ({ colorMap = {}, selectGenre }) => {
  const classes = useStyles()
  const { loading, data } = useQuery(gql`query {
    masterGenres {
      id
      name
    }
  }`)

  return <>
    <div className={classes.container}>
      {loading && <LinearProgress />}
      {data && data.masterGenres.map((genre, i) => <Chip
        key={i}
        variant="outlined"
        onClick={selectGenre && ((e) => {
          e.preventDefault()
          e.stopPropagation()
          selectGenre(genre, data.masterGenres)
        })}
        style={{
          backgroundColor: colorMap[genre.id],
          textShadow: colorMap[genre.id] ? '0px 0px 2px #000' : ''
        }}
        className={classes.genreButton}
        label={genre.name}
      />)}
    </div>
  </>
}