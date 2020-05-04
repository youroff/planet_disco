import React from 'react'
import CitySelector from './city_selector'
import { Paper, Typography, ButtonGroup, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Language as PlanetIcon,
  LocationCity as CitiesIcon,
  MusicNote as GenresIcon
} from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  panel: {
    padding: theme.spacing(2),
    pointerEvents: "auto",
    '& h1': {
      marginBottom: theme.spacing(2)
    }
  },
  switch: {
    marginBottom: theme.spacing(3)
  }
}))

export default ({onCitySelect}) => {  
  const classes = useStyles()

  return <Paper className={classes.panel}>
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

  </Paper>
}