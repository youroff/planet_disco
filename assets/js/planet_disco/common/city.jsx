import React, { useState } from 'react'
import { Paper, Typography, Slider, Button, ButtonGroup } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import TopArtists from './top_artists'
import TopGenres from './top_genres'

const useStyles = makeStyles((theme) => ({
  city: {
    padding: theme.spacing(2),
    pointerEvents: "auto",
    height: "100%",
    '& h1': {
      marginBottom: theme.spacing(2)
    }
  },
  selector: {
    marginTop: theme.spacing(3)
  }
}))

export default ({city}) => {
  const classes = useStyles()
  const [selector, setSelector] = useState('artists')

  return  <Paper className={classes.city}>
    <Typography variant="h5" gutterBottom>
      {city.city}, {city.humanCountry}
    </Typography>

    <Typography variant="subtitle1">
      Threshold distance
    </Typography>

    <Typography variant="caption">
      Only those similar cities will be displayed that at this distance and farther
    </Typography>

    <Slider
      defaultValue={500}
      step={10}
      marks
      min={0}
      max={5000}
      track="inverted"
      valueLabelDisplay="auto"
    />

    <ButtonGroup className={classes.selector} fullWidth size="large">
      <Button
        variant={selector == 'artists' ? 'contained' : 'outlined'}
        onClick={() => setSelector('artists')}
      >
        Top artists
      </Button>
      <Button
        variant={selector == 'genres' ? 'contained' : 'outlined'}
        onClick={() => setSelector('genres')}
      >
        Top genres
      </Button>
    </ButtonGroup>
    {selector == 'artists' ? <TopArtists city={city} /> : <TopGenres city={city} />}
  </Paper>
}