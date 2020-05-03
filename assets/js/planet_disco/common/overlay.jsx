import React, { useState } from 'react'
import { Grid, Hidden } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import City from './city'
import Panel from './panel'

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 1000,
    height: "100%",
    width: "100%",
    margin: 0
  }
}))

export default ({onCitySelect}) => {  
  const classes = useStyles()
  const [currentCity, setCurrentCity] = useState()

  return <Grid container className={classes.root} spacing={3}>
    <Grid item xs={3}>
      <Panel onCitySelect={setCurrentCity} />
    </Grid>
    <Grid item xs={6} implementation="css" component={Hidden} />
    <Grid item xs={3}>
      {currentCity && <City city={currentCity} />}
    </Grid>
  </Grid>
}