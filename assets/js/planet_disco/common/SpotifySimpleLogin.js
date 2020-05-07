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
    height: 200,
    width: "100%",
    paddingLeft: "5%"
  },
});

const clientId = "6371ef37c4fc48a18b52a3837f1b51a9"

class SpotifySimpleLogin extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Box className={classes.root}>
          <a href={`https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=http:%2F%2Flocalhost:4000&scope=&response_type=token&state=`}>
            <Button
              type="button"
              variant="contained"
              color="primary"
            >
              Log in
              </Button>
          </a>
          </Box>
      </React.Fragment>
    );
  }
}


SpotifySimpleLogin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpotifySimpleLogin);
