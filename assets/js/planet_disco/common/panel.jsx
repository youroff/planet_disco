import React from 'react'
import CitySelector from './city_selector'
import { Paper, Typography, ButtonGroup, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { views } from './views'

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
    },
    // backdropFilter: "blur(6px)",
    // backfaceVisibility: "hidden"
  },
  switch: {
    marginBottom: theme.spacing(3)
  }
}))

export default ({view, onCitySelect, onViewChange}) => {  
  const classes = useStyles()

  return <Paper className={classes.panel}>
    <Typography variant="h4" component="h1">
     <b>Disco Planet  {String.fromCodePoint(0x1F30D)}</b>
    </Typography>

    <ButtonGroup className={classes.switch} fullWidth size="large">
      <Button variant={view == views.PLANET ? "contained" : "outlined"} onClick={() => onViewChange(views.PLANET)}>
        <PlanetIcon />
      </Button>
      <Button variant={view == views.CITY ? "contained" : "outlined"} onClick={() => onViewChange(views.CITY)}>
        <CitiesIcon />
      </Button>
      <Button>
        <GenresIcon />
      </Button>
    </ButtonGroup>

    <CitySelector onChange={onCitySelect} />

  </Paper>
}