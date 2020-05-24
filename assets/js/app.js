// require("babel-polyfill")
import _ from "../css/app.css"

import React from 'react'
import ReactDOM from 'react-dom'
import Router from './router'

// render(<Router />, document.getElementById('root'))
// console.log(RectDOMRoot)
// console.log(ReactDOM)
ReactDOM.unstable_createRoot(document.getElementById('root')).render(<Router />)