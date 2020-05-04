import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Box, ButtonGroup } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core';
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { Paper } from '@material-ui/core'
import ListItemText from '@material-ui/core/ListItemText';
import SpotifySimpleLogin from './SpotifySimpleLogin';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    pointerEvents: "auto"
  },
}));

const ARTISTS = gql`
 query CityArtists($cityId: ID){
artists(sortBy: "listeners", byCity: $cityId, limit:10) {
  entries {
    name
    spotifyId
  }
  cursor
}
}`;

function getParameterByName(name) {
  var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getAccessToken() {
  return getParameterByName('access_token');
}

export default function Player({ city }) {
  const classes = useStyles();
  const accessToken = getAccessToken()
  const [audioState, setAudioState] = useState({
    audioIndex: 0,
    audioQueue: []
  });

  const variables = { cityId: city.id }
  const { loading, data, refetch } = useQuery(ARTISTS, { variables });

  useEffect(() => {
    if (data)
      fetchSongs(data.artists.entries).then((q) => {
        setAudioState({
          audioIndex: 0,
          audioQueue: q
        })
      })
  }, [data])

  const fetchSongs = (artistList) => {
    let audioPromiseQueue = [];
    artistList.forEach(({ name, spotifyId }) => {
      const url = `https://api.spotify.com/v1/artists/${spotifyId}/top-tracks?country=SE`;
      let result = fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then(res => res.json())
        .then(
          (result) => {
            const track = result.tracks[0];
            const track_url = track.preview_url;
            const track_name = track.name;
            const audio = new Audio(track_url);
            return { audio: audio, artistName: name, track_name: track_name }
          }
        )
      audioPromiseQueue.push(result);
    })

    return Promise.all(audioPromiseQueue)
  }

  // useEffect(() => {
  //   return () => {
  //     debugger
  //     pause()
  //     console.log('******************* UNMOUNTED');
  //   };
  // }, []);

  useEffect(() => {
    let a = play();
    return () => {
      if (a)
        a.audio.pause()
    }
  }, [audioState]);

  const play = () => {
    let a = getCurrentAudio();
    if (a) {
      a.audio.addEventListener('ended', next);
      a.audio.play();
    }
    return a;
  }

  const getCurrentAudio = () => {
    return audioState.audioQueue[audioState.audioIndex];
  }

  const pause = () => {
    let a = getCurrentAudio();
    if (a)
      a.audio.pause();
  }

  const next = () => {
    pause();
    if (audioState.audioIndex < audioState.audioQueue.length - 1) {
      setAudioState({
        audioIndex: audioState.audioIndex + 1,
        audioQueue: audioState.audioQueue
      })
    }
  }

  const getPlayer = () => {
    return (
      <Grid container spacing={1}>
        <Box md={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={play}
          >
            Play
            </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={pause}
          >
            Pause
            </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={next}
          >
            Next
            </Button>
        </Box>
        <Grid item md={12}>
          <List>
            {audioState.audioQueue && audioState.audioQueue.map(({ _, artistName, track_name }, i) => (
              <ListItem key={artistName} selected={i == audioState.audioIndex}>
                <ListItemText primary={track_name} secondary={artistName} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    )
  }
  return (
    <Paper className={classes.root}>
      {accessToken ?
        getPlayer() : <SpotifySimpleLogin />}
    </Paper>
  )
}
