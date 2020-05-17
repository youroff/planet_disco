import React, { useState } from 'react'
import { Paper, Typography, Slider, Button, ButtonGroup } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import TopArtists from './top_artists'
import TopGenres from './top_genres'
import Similar from './similar'

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
    }
  },
  selector: {
    marginTop: theme.spacing(3)
  }
}))

export default ({ city, similarCities }) => {
  const classes = useStyles()
  const [selector, setSelector] = useState('artists')

  return  <Paper className={classes.city}>
    <div>
      <Typography variant="h5" gutterBottom>
        {city.city}, {city.humanCountry}
      </Typography>

      {similarCities.length > 0 && <Similar cities={similarCities} />}

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