import React, { useState, useEffect, Fragment, useRef } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

function isOverflown(element) {
  return element.scrollWidth > element.clientWidth;
}

const useStyles = makeStyles((theme) => ({
  link: {
    color: "inherit",
    textDecoration: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    maxWidth: "90%",
    '&:hover': {
      textDecoration: "underline",
    },
  },
  marqueeWrapper: {
    display: "inline-block",
    animation: "$marquee-away 10s linear 2s 2",
  },
  "@keyframes marquee-away": {
    "0%": {
      transform: "translate(0, 0)"
    },
    "33%": {
      transform: "translate(-100%, 0)"
    },
    "33.0001%": {
      transform: "translate(100%, 0)"
    },
    "66%": {
      transform: "translate(0, 0)"
    },
    "100%": {
      transform: "translate(0, 0)"
    }
  },
}))

export default function PlayerLink({ href, content, header }) {
  const elementRef = useRef()
  const classes = useStyles()

  useEffect(() => {
    if (isOverflown(elementRef.current)) {
      elementRef.current.classList.add(classes.marqueeWrapper);
    }
  }, [content])

  const getInner = () => (
    <a className={classes.link} target="_blank" rel="noopener noreferrer"
      href={href}>
      {content}
    </a>
  )

  return (
    <div ref={elementRef} key={content}>
      {header ?
        <Typography component="h5" variant="h5"> {getInner()} </Typography>
        : <Typography variant="subtitle1" color="textSecondary"> {getInner()} </Typography>}
    </div >
  )
}
