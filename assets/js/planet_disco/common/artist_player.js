import React, { useState, useEffect, Fragment } from 'react'

import { Paper } from '@material-ui/core'
import SpotifySimpleLogin from './spotify_simple_login';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';

import Skeleton from '@material-ui/lab/Skeleton';

import PlayerLink from './player_link'

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
  },
  root: {
    display: 'flex',
    width: "100%",
    justifyContent: 'space-between',
    pointerEvents: "auto",
    zIndex: 10,
  },
  details: {
    flex: '2 0 auto',
    maxWidth: "60%",
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    padding: 0,
    margin: theme.spacing(2),
    overflow: "hidden",
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
  placeholder: {
    backgroundColor: theme.palette.background.default,
  }
}));

function getParameterByName(name) {
  var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getAccessToken() {
  return getParameterByName('access_token');
}

export default function ArtistPlayer({ currentArtist, fetchNext }) {
  const classes = useStyles();
  const [playing, setPlaying] = useState(true)
  const [currentAudio, setAudioState] = useState(null)
  const [accessToken, setAccessToken] = useState(getAccessToken())

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
          if (result.error && result.error.status == 401) {
            setAccessToken(null)
            return null;
          }

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

  useEffect(() => {
    if (currentArtist && accessToken) {
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
    if (!currentAudio) {
      fetchNext()
    }
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
            {currentAudio ?
              <Fragment>
                <div onClick={pause}>
                  <PlayerLink href={`https://open.spotify.com/track/${currentAudio.trackId}`} content={currentAudio.trackName} header={true} />
                  <PlayerLink href={`https://open.spotify.com/artist/${currentAudio.artistId}`} content={currentAudio.artistName} header={false} />
                </div>
              </Fragment>
              :
              <Fragment>
                <Skeleton className={classes.placeholder} variant="text" animation={false} width={"80%"} height={"35px"} />
                <Skeleton className={classes.placeholder} variant="text" animation={false} width={"60%"} height={"20px"} />
              </Fragment>
            }
          </CardContent>
          <div className={classes.controls}>
            <IconButton aria-label="play/pause" onClick={() => setPlaying(!playing)}>
              {playing ?
                <PauseCircleFilledIcon className={classes.playIcon} />
                : <PlayArrowIcon className={classes.playIcon} />}
            </IconButton>
            <IconButton aria-label="next" onClick={next}>
              <SkipNextIcon />
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
    <Paper className={classes.container}>
      {getPlayer()}
      {!accessToken &&
        <SpotifySimpleLogin />}
    </Paper>
  )
}
