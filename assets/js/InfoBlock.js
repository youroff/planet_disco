import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Deposits from './Deposits';
import CitySimilarities from './CitySimilarities'
import Header from './Header';
import Title from './Title';
import { Box, Button } from '@material-ui/core'


export default function InfoBlock(props) {
  return (
    <Grid item xs={8}>
      <Paper>
        <Title><a name={props.name}>{props.name}</a></Title>
        <Box p={1}>
          <p>
            {props.content}
          </p>
        </Box>
      </Paper>
    </Grid>
  );
}
