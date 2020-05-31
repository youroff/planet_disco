import _ from "../css/app.css"

import React from 'react'
import { render } from 'react-dom'
import Router from './router'

// iOS 13 hack to prevent pinch-zoom
document.addEventListener('touchmove', function(event) {
  event = event.originalEvent || event;
  if (event.scale !== 1) {
     event.preventDefault();
  }
}, {passive: false})

render(<Router />, document.getElementById('root'))
