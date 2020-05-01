import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Box } from '@material-ui/core'

import React from 'react'
import { Grid } from '@material-ui/core';

const styles = theme => ({
  root: {
    height: 100,
    width: "100%",
    paddingLeft: "5%"
  },
});

class CitySearch extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSearch(this.state.city);
  }

  handleChange(e) {
    this.setState({ city: e.target.value })
  }

  render() {
    const { classes } = this.props;
    return (
      // <fieldset className={classes.citySearch}>
      //   <legend>Search a city:</legend>
      //   <input onChange={this.handleChange} />
      // </fieldset>
      <React.Fragment>
        <CssBaseline />
        <form className={classes.root} onSubmit={this.handleSubmit} noValidate>
          <Grid container spacing={1}>
            <Grid item md={8} >
              <TextField
                onChange={this.handleChange}
                variant="outlined"
                margin="normal"
                fullWidth
                id="search"
                label="Search city"
                name="search"
              />
            </Grid>
            <Grid item md={4} align='left'>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width={100} height={80}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Search
              </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </React.Fragment>

    );
  }
}


CitySearch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CitySearch);
