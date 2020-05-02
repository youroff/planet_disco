import React from 'react'
import CitySelector from './city_selector'
import { Grid, Paper, Typography, ButtonGroup, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Language as PlanetIcon,
  LocationCity as CitiesIcon,
  MusicNote as GenresIcon
} from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: "absolute",
    pointerEvents: "none",
    margin: theme.spacing(2),
    zIndex: 1000
  },
  children: {
    pointerEvents: "auto"
  },
  panel: {
    padding: theme.spacing(2),
    background: 'rgba(66, 66, 66, 0.6)',
    '& h1': {
      marginBottom: theme.spacing(2)
    }
  },
  switch: {
    marginBottom: theme.spacing(2)
  }
}))

export default ({onCitySelect}) => {  
  const classes = useStyles()

  return <Grid className={classes.root} container spacing={3}>
    <Grid className={classes.children} item xs={3}>
      <Paper className={classes.panel}>
        <Typography variant="h4" component="h1">
          Spotify Tracker
        </Typography>

        <ButtonGroup className={classes.switch} fullWidth size="large">
          <Button variant="contained">
            <PlanetIcon />
          </Button>
          <Button>
            <CitiesIcon />
          </Button>
          <Button>
            <GenresIcon />
          </Button>
        </ButtonGroup>
  
        <CitySelector onChange={onCitySelect} />

        <hr/>
      </Paper>
    </Grid>
  </Grid>
}