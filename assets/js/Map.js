import { makeStyles } from '@material-ui/core/styles';
import Title from './Title';
import * as topojson from "topojson-client";
import { Box } from '@material-ui/core'

import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.gRef = React.createRef();
  }

  componentDidMount() {
    this.props.handleData().then((data) => {
      const projection = d3.geoMercator()
        .center([200, -20])
        .scale(100)

      const path = d3.geoPath()
        .projection(projection);

      const g = d3.select(this.gRef.current);

      d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then((topology) => {
        g.selectAll("path")
          .data(topojson.feature(topology, topology.objects.countries).features)
          .enter().append("path")
          .attr("d", path);

        g.selectAll("circle")
          .data(data)
          .join("circle")
          .attr("cx", function (d) {
            var p = projection([+d.g_x, +d.g_y]);
            return p[0];
          })
          .attr("cy", d => projection([+d.g_x, +d.g_y])[1])
          .attr("r", 2)
          .attr("fill", d => d.color)
      });
    })
  }

  render() {
    return (
      <React.Fragment>
        <svg width="100%" height="90%" viewBox="0 0 300 400">
          <g ref={this.gRef}></g>
        </svg>
      </React.Fragment>
    );
  }
}
