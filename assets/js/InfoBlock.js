import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Title from './Title';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  blockTitle: {
  }
}));

export default function InfoBlock(props) {
  const classes = useStyles();
  return (
    <Grid item xs={12} md={4}>
      <Paper>
        <Title className={classes.blockTitle}><a name={props.name.replace(" ", "")}>{props.name}</a></Title>
        <Box p={1} pt={0}>
          <p>
            {props.content}
          </p>
        </Box>
      </Paper>
    </Grid>
  );
}
