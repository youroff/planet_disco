import Button from '@material-ui/core/Button';
import { Box, ButtonGroup } from '@material-ui/core'

import React, { useState, useEffect, Fragment } from 'react'
import { Grid } from '@material-ui/core';

import { Paper } from '@material-ui/core'
import SpotifySimpleLogin from './SpotifySimpleLogin';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: "100%",
    justifyContent: 'space-between',
    pointerEvents: "auto"
  },
  details: {
    flex: '2 0 auto',
    maxWidth: "60%",
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  link: {
    color: "inherit",
    display: "inline-block",
    textDecoration: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "90%",
    '&:hover': {
      textDecoration: "underline",
    },
  }
}));

function getParameterByName(name) {
  var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getAccessToken() {
  return getParameterByName('access_token');
}

const accessToken = getAccessToken()

const fetchSong = (artist) => {
  const spotifyId = artist.spotifyId;
  const url = `https://api.spotify.com/v1/artists/${spotifyId}/top-tracks?country=CH`;
  let result = fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })
    .then(res => res.json())
    .then(
      (result) => {
        try {
          const track = result.tracks[0];

          let cover = null;
          try {
            cover = track.album.images[1].url;
          } catch (err) {
            console.log(err)
          }

          return {
            audio: new Audio(track.preview_url),
            artistName: artist.name,
            artistId: spotifyId,
            trackName: track.name,
            trackId: track.id,
            albumCover: cover,
          }
        } catch (err) {
          console.log(err)
          return null;
        }
      }
    )
  return result;
}


export default function ArtistPlayer({ currentArtist, fetchNext }) {
  const classes = useStyles();
  const theme = useTheme();
  const [playing, setPlaying] = useState(true)
  const [currentAudio, setAudioState] = useState(null)

  useEffect(() => {
    if (currentArtist) {
      fetchSong(currentArtist).then((result) => {
        pause();
        setAudioState(result)
      })
    } else {
      setPlaying(false)
    }
  }, [currentArtist])

  const controlPlayback = () => {
    if (playing) {
      let a = play();
      return () => {
        if (a)
          a.pause()
      }
    }
    pause()
  }

  useEffect(() => {
    if (!currentAudio)
      // setPlaying(false)
      fetchNext()
    else
      setPlaying(true)
  }, [currentAudio])

  useEffect(() => controlPlayback());

  const getCurrentAudio = () => {
    return currentAudio ? currentAudio.audio : null;
  }

  const play = () => {
    let a = getCurrentAudio();
    if (a) {
      a.addEventListener('ended', next);
      a.play();
    }
    return a;
  }

  const pause = () => {
    let a = getCurrentAudio();
    if (a)
      a.pause();
  }

  const next = () => {
    pause();
    fetchNext();
  }

  const getPlayer = () => {
    return (
      <Card className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            {currentAudio &&
              <Fragment>
                <Typography component="h5" variant="h5">
                  <a className={classes.link} target="_blank" rel="noopener noreferrer"
                    href={`https://open.spotify.com/track/${currentAudio.trackId}`}>
                    {currentAudio.trackName}
                  </a>
                </Typography>

                <Typography variant="subtitle1" color="textSecondary">
                  <a className={classes.link} target="_blank" rel="noopener noreferrer"
                    href={`https://open.spotify.com/artist/${currentAudio.artistId}`}>
                    {currentAudio.artistName}
                  </a>
                </Typography>

              </Fragment>}
          </CardContent>
          <div className={classes.controls}>
            <IconButton aria-label="play/pause" onClick={() => setPlaying(!playing)}>
              {playing ?
                <PauseCircleFilledIcon className={classes.playIcon} />
                : <PlayArrowIcon className={classes.playIcon} />}
            </IconButton>
            <IconButton aria-label="next" onClick={next}>
              {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
            </IconButton>
          </div>
        </div>
        <CardMedia
          className={classes.cover}
          image={currentAudio && currentAudio.albumCover ? currentAudio.albumCover : '/images/album-placeholder.png'}
          title="album cover"
        />
      </Card>
    )
  }
  return (
    <Paper className={classes.root}>
      {accessToken ?
        getPlayer() : <SpotifySimpleLogin />}
    </Paper>
  )
}