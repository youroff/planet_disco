import React, { useContext } from 'react'
import { Grid, Hidden } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import City from './city'
import Panel from './panel'
import { StoreContext } from './store'

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
    maxHeight: "100%"
  }
}))

export default () => {  
  const classes = useStyles()
  const { state } = useContext(StoreContext)

  return <Grid container className={classes.root} spacing={3}>
    <Grid className={classes.children} item xs={3}>
      <Panel />      
    </Grid>
    <Grid item xs={6} implementation="css" component={Hidden} />
    <Grid className={classes.children} item xs={3}>
      {state.currentCity && <City city={state.currentCity} />}
    </Grid>
  </Grid>
}