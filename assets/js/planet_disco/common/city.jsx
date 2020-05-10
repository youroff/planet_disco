import React, { useState, Fragment } from 'react'
import { Paper, Typography, Slider, Button, ButtonGroup } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import TopArtists from './top_artists'
import TopGenres from './top_genres'
import view, { views } from './views'

const useStyles = makeStyles((theme) => ({
  city: {
    padding: theme.spacing(2),
    pointerEvents: "auto",
    maxHeight: "100%",
    height: "100%",
    display: "flex",
    flex: "auto",
    flexDirection: "column",
    '& h1': {
      marginBottom: theme.spacing(2)
    },
    // backdropFilter: "blur(6px)",
    // backfaceVisibility: "hidden"
  },
  selector: {
    marginTop: theme.spacing(3)
  }
}))

export default ({ view, city }) => {
  const classes = useStyles()
  const [selector, setSelector] = useState('artists')

  return <Paper className={classes.city}>
    <div>
      <Typography variant="h5" gutterBottom>
        {city.city}, {city.humanCountry}
      </Typography>
      {view == views.PLANET &&
        <Fragment>
          <Typography variant="subtitle1">
            Threshold distance
          </Typography>

          <Typography variant="caption">
            Only those similar cities that are at this distance or farther will be displayed
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
        </Fragment>
      }

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
    </div>
    {selector == 'artists' ? <TopArtists city={city} /> : <TopGenres city={city} />}
  </Paper>
}