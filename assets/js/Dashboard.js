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
import InfoBlock from './InfoBlock'

const sections = [
  { title: 'Description', url: '#Description' },
  { title: 'City View', url: '#CityView' }, 
  { title: 'Data', url: '#Data' },
  { title: 'About', url: '#About' },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    // flexGrow: 1,
    height: '90vh',
    overflowY: 'auto',
    paddingBottom: "80vh",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4), 
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const cities = clsx(classes.cities);

  return (
    <div className={classes.root} >
      <CssBaseline />
      <Container maxWidth="xl" className={classes.container}>
        <Header title="Disco Planet" sections={sections} />
        <main className={classes.content}>
          <Grid container spacing={3}>            
            <InfoBlock name='Description' content=
              "Here you can see a map of the world according to the musical preferences of those who live in those cities.
              The closer two cities are on a map the closer should be the musical profiles of those cities. 
              The cities are colored according to their position on the geographical map. If two cities have 
              a similar color they should be close geographically (however, the inverse is not necesserilly true)." />

            {/* Chart */}
            <Grid item xs={12}>
              <CitySimilarities />
            </Grid>

            <InfoBlock name='Data' content=
              'The data was collected by collecting the "About" block of a sample of artists from Spotify.' />

            <InfoBlock name='About' content=
              'This visualization was created as a project assignement for the "Data Visualization" course at EPFL.' />

          </Grid>
        </main>
      </Container>
    </div>
  );
}
