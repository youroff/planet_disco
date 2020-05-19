import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import CitySelector from './city_selector'
import GenreSelector from './genre_selector'
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
    maxHeight: "100%",
    height: "100%",
    display: "flex",
    flex: "auto",
    flexDirection: "column",
    '& h1': {
      marginBottom: theme.spacing(2)
    }
  },
  scrollable: {
    overflowY: "scroll",
    scrollBehavior: "smooth",
    height: "100%"
  },
  switch: {
    marginBottom: theme.spacing(3)
  }
}))

export default ({ onCitySelect }) => {
  const location = useLocation()
  const classes = useStyles()
  const buttonVariant = (path) => location.pathname === path ? 'contained' : 'outlined'

  return <Paper className={classes.panel}>
    <Typography variant="h4" component="h1">
      Spotify Tracker
    </Typography>

    <ButtonGroup className={classes.switch} fullWidth size="large">
      <Button variant={buttonVariant('/')} component={Link} to="/">
        <PlanetIcon />
      </Button>
      <Button variant={buttonVariant('/cities')} component={Link} to="/cities">
        <CitiesIcon />
      </Button>
      <Button variant={buttonVariant('/genres')} component={Link} to="/genres">
        <GenresIcon />
      </Button>
    </ButtonGroup>
    <CitySelector />
    <div className={classes.scrollable}>
      <GenreSelector />
    </div>
  </Paper>
}
