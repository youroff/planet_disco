import React from 'react'
import { Paper, Typography, Slider, Button, ButtonGroup } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CitySelector from '../common/city_selector'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    pointerEvents: "auto",
    maxHeight: "100%",
    display: "flex",
    flex: "auto",
    flexDirection: "column",
  }
}))

export default () => {
  const classes = useStyles()

  return <Paper className={classes.root}>
    <CitySelector />
  </Paper>
}