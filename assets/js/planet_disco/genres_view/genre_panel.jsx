import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Paper, Typography, IconButton } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'
import TopArtists from '../common/top_artists'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    pointerEvents: "auto",
    maxHeight: "100%",
    display: "flex",
    flex: "auto",
    flexDirection: "column",
  }
}))

export default ({ genre, selectGenre }) => {
  const classes = useStyles()

  return <Paper className={classes.root}>
    <div>
      <Typography variant="h5" gutterBottom>
        {genre.name}
        <IconButton onClick={() => selectGenre()}>
          <CloseIcon />
        </IconButton>
      </Typography>            
    </div>
    <TopArtists genre={genre} /> 
  </Paper>
}