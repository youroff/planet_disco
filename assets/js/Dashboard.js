import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CitySimilarities from './CitySimilarities'
import Header from './Header';
import Title from './Title';
import { Box, Button } from '@material-ui/core'
import InfoBlock from './InfoBlock'
import PlanetDisco from './planet_disco'

const sections = [
  { title: 'Data', url: '#Data' },
  { title: 'About', url: '#About' },
  { title: 'Planet View', url: '#PlanetView' },
  { title: 'City View', url: '#CityView' },
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    // flexGrow: 1,
    height: '90vh',
    overflowY: 'auto',
    // paddingBottom: "20vh",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  planet: {
    height: "80vh",
    background: "black"
  }
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
          <Grid container spacing={3} style={{
            margin: 0,
            width: '100%',
          }}>
            <InfoBlock name='Data' content=
              'The data was collected by collecting the "About" block of a sample of artists from Spotify.' />

            <InfoBlock name='About' content=
              'This visualization was created as a project assignement for the "Data Visualization" course at EPFL.' />

            <InfoBlock name='Planet View' content=
              "Below you can see bla bla. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." />

            <Grid item xs={11}>
              <Paper className={classes.planet}>
                <PlanetDisco />
              </Paper>
            </Grid>
            <InfoBlock name='City View' content=
              "Here you can see a map of the world according to the musical preferences of those who live in those cities. The closer two cities are on a map the closer should be the musical profiles of those cities. The cities are colored according to their position on the geographical map. If two cities have a similar color they should be close geographically (however, the inverse is not necesserilly true)." />

            {/* Chart */}
            <Grid item xs={12}>
              <CitySimilarities />
            </Grid>

          </Grid>
        </main>
      </Container>
    </div>
  );
}
