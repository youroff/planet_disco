import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Title from './Title';
import { Box, Button } from '@material-ui/core'


export default function InfoBlock(props) {
  return (
    <Grid item xs={8}>
      <Paper>
        <Title><a name={props.name.replace(" ", "")}>{props.name}</a></Title>
        <Box p={1}>
          <p>
            {props.content}
          </p>
        </Box>
      </Paper>
    </Grid>
  );
}
