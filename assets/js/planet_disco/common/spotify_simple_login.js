import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import React from 'react'
import {Paper, Box} from '@material-ui/core'

const styles = theme => ({
  root: {
    height: "100%",
    width: "100%",
    paddingLeft: "5%",
    "& a": {
      textDecoration: "none",
    },
    position: "absolute",
    zIndex: 1,
    top: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    align: "center",
    backgroundColor: 'rgba(71, 80, 98, 0.8)',
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
        <Paper className={classes.root}>
          <div style={{width: "auto", margin: "0 auto"}}>
          <a href={`https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=http:%2F%2Flocalhost:4000&scope=&response_type=token&state=`}>
            <Button
              type="button"
              variant="contained"
              color="primary"
            >
              Log in with Spotify
              </Button>
          </a>
          </div>
          </Paper>
      </React.Fragment>
    );
  }
}


SpotifySimpleLogin.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SpotifySimpleLogin);
