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
  },
  children: {
    maxHeight: "100%",
  }
}))



export default ({currentCity, view, onCitySelect, onViewChange}) => {  
  const classes = useStyles()

  return <Grid container className={classes.root} spacing={3}>
    <Grid className={classes.children} item xs={3}>
      <Panel view={view} onCitySelect={onCitySelect} onViewChange={onViewChange} />
    </Grid>
    <Grid item xs={6} implementation="css" component={Hidden} />
    <Grid className={classes.children} item xs={3}>
      {currentCity && <City view={view} city={currentCity} />}
    </Grid>
  </Grid>
}