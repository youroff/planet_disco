import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Paper, Typography, IconButton } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

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

export default ({ genre, selectCluster }) => {
  const classes = useStyles()

  return <Paper className={classes.root}>
    <div>
      <Typography variant="h5" gutterBottom>
        {genre.name}
        <IconButton onClick={() => selectCluster()}>
          <CloseIcon />
        </IconButton>
      </Typography>            
    </div>
    {/* <TopArtists city={city} />  */}
  </Paper>
}