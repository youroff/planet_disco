import React, { useContext, useMemo } from 'react'
import { Typography, Chip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { scaleLinear } from 'd3-scale'
import { StoreContext } from './store'

const useStyles = makeStyles((theme) => ({
  cityButton: {
    marginLeft: '2px',
    marginBottom: '2px'
  }
}))

const color = scaleLinear().domain([0, 1]).range(["#00ff26", "#ff9900"])

export default ({ cities }) => {
  const { dispatch } = useContext(StoreContext)
  const classes = useStyles()

  return  <>
      <Typography variant="subtitle1">
        Similar cities
      </Typography>

      <div>
        {cities.map((city, i) => <Chip
          key={i}
          variant="outlined"
          size="small"
          onClick={() => dispatch({type: 'SET_CITY', city})}
          style={{borderColor: color(city.similarity)}}
          className={classes.cityButton}
          label={city.city}
        />)}
      </div>  
  </>
}