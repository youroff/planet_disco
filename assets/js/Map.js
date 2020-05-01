import { makeStyles } from '@material-ui/core/styles';
import Title from './Title';
import * as topojson from "topojson-client";
import { Box, Button } from '@material-ui/core'

import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.gRef = React.createRef();
    this.svgRef = React.createRef();
    this.transform = d3.zoomIdentity;
    this.state = { brush: false };
  }

  componentDidMount() {
    this.props.handleData().then((data) => {
      const projection = d3.geoMercator()
        .center([200, -20])
        .scale(100)

      const path = d3.geoPath()
        .projection(projection);

      const svg = d3.select(this.svgRef.current);
      const g = d3.select(this.gRef.current);
      const width = this.svgRef.current.parentElement.clientWidth;
      const height = this.svgRef.current.parentElement.clientHeight;

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

        const updateChart = () => {
          let extent = d3.event.selection;
          const isBrushed = (d) => {
            let x0 = extent[0][0],
              x1 = extent[1][0],
              y0 = extent[0][1],
              y1 = extent[1][1];

            let proj = projection([+d.g_x, +d.g_y]);
            let cx = proj[0] * this.transform.k + this.transform.x;
            let cy = proj[1] * this.transform.k + this.transform.y;
            d.highlight = x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
          }
          data.forEach(isBrushed);
          this.props.redraw();
        }

        const zoomed = () => {
          let transform = d3.event.transform;
          this.transform = transform;
          g.attr("transform", transform).attr("stroke-width", 5 / transform.k);
          g.selectAll("circle").attr("r", 2 / transform.k);
        }

        this.brush = svg.append("g");

        this.brush.call(d3.brush()
          .extent([[-200, 20], [width, height]])
          .on("start brush", updateChart)).attr("display", "none")

        const zoom = d3.zoom()
          .scaleExtent([0.5, 32])
          .on("zoom", zoomed);

        svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
      });
    })
  }

  toggleBrush = () => {
    this.setState({ brush: !this.state.brush })
    this.brush.attr("display", this.state.brush ? "none" : "inline");
  }

  render() {
    return (
      <React.Fragment>
        <svg ref={this.svgRef} width="100%" height="90%" viewBox="0 0 300 400">
          <g ref={this.gRef}></g>
        </svg>
        <Box m={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={this.toggleBrush}
          >
           Enable {this.state.brush ? "move" : "brush"}
          </Button>
        </Box>
      </React.Fragment>
    );
  }
}
