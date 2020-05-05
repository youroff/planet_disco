import Title from '../Title';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Map from '../Map';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import React from 'react'
import * as d3 from 'd3'

const zoomExtent = [0.7, 32];
const labelExtent = [1, 10];
const baseFontSize = 15;
const labelOffsetY = -8;
const initialScale = 0.7;

const isChrome = !!window.chrome;

const myColor = d3.scaleSequential().domain([0, 1])
  .interpolator(d3.interpolateSpectral);

const styles = theme => ({
  root: {
    letterSpacing: "initial",
    background: 'rgb(34, 37, 45)',
    width: "100%",
    height: "100%"
  },
  fixedHeight: {
    height: '50vh',
  },
  cities: {
    height: '80vh',
  }
});

class CitySimilarities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    }

    this.canvasRef = React.createRef();
    this.currentK = initialScale;
  }


  rescaleContext = (context, transform) => {
    context.save();
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);
  }

  zoomCanvas = (transform) => {
    this.currentK = transform.k;
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.hiddenCtx.clearRect(0, 0, this.width, this.height);

      this.data.forEach((d) => {
        let newX = d.cx * transform.k + transform.x;
        let newY = d.cy * transform.k + transform.y;
        d.visible = (newX > 0 && newX < this.width) && (newY > 0 && newY < this.height)
      })

      this.rescaleContext(this.hiddenCtx, transform);
      this.drawGlow();
      this.hiddenCtx.restore();

      this.rescaleContext(this.ctx, transform);

      this.drawPoints();

      this.drawLabels();
      this.ctx.restore();

    });
  }

  drawGlow = () => {
    const radiusScale = 1.5;
    this.showVisible((d) => {
      if (d.highlight)
        this.drawPoint(d, this.hiddenCtx, radiusScale, false)
    })

    if (isChrome) { //Only chrome seems to be able to handle it at the moment
      this.ctx.save();
      let filter = `blur(${7}px) saturate(110%) brightness(110%) `;
      this.ctx.filter = filter;
    }
    this.ctx.drawImage(this.hiddenCanvas, 0, 0);
    if (isChrome)
      this.ctx.restore();

  }

  drawPoints = () => {
    this.showVisible(d => this.drawPoint(d, this.ctx))
  }

  showVisible = (f) => {
    this.data.forEach((d) => {
      if (d.visible)
        f(d)
    });
  }

  drawLabels = () => {
    this.ctx.fillStyle = "white";
    let fontSize = Math.max(12 / this.currentK, baseFontSize / (Math.pow(this.currentK, 1.8)));
    this.ctx.font = CitySimilarities.getFont(fontSize);
    this.showVisible(d => this.drawLabel(d))
  }

  redraw = () => {
    this.zoom.scaleTo(this.canvas, this.currentK);
  }

  static getFont(fontSize) {
    return `${fontSize}px Arial, sans-serif`;
  }

  drawPoint = (d, context, radiusScale = 1, color = true) => {
    context.beginPath();
    context.arc(d.cx, d.cy, radiusScale * d.radius / this.currentK, 0, 2 * Math.PI);
    context.fillStyle = color ? d.color : "white";
    context.fill();
  }

  drawLabel = (d) => {
    if (d.rank < 11 || d.scale <= this.currentK) {
      this.ctx.fillText(d.city, d.cx + this.labelXOffset(d), d.cy + labelOffsetY / this.currentK);
    }
  }

  labelXOffset = (d) => {
    let x = - this.ctx.measureText(d.city).width / 2;
    return x;
  }

  prepareData = () => {
    let data = this.data;
    let x = d3.scaleLinear().range([0, this.width]);
    let y = d3.scaleLinear().range([this.height, 0]);

    const labelScale = d3.scaleLinear().range(labelExtent).domain(d3.extent(data, (d) => +d.rank));
    const ex = d3.extent(data, (d) => +d.population);
    const populationRadius = d3.scaleLinear().domain(ex).range([3, 10]);
    // Scale the range of the data
    x.domain(d3.extent(data, (d) => +d.x));
    y.domain(d3.extent(data, (d) => +d.y));

    data.forEach(function (d) {
      d.population = +d.population;
      d.radius = populationRadius(d.population);
      d.rank = +d.rank;
      d.x = +d.x;
      d.y = +d.y;
      d.cx = x(d.x);
      d.cy = y(d.y);
      d.geohash_norm = +d.geohash_norm;
      d.color = myColor(d.geohash_norm)
      d.scale = labelScale(d.rank);
      d.visible = true;
      d.highlight = false;
    });
  }

  setCanvasDimensions = () => {
    let canvasNode = this.canvas.node()

    canvasNode.width = this.width;
    canvasNode.height = this.height;

    this.hiddenCanvas.width = this.width;
    this.hiddenCanvas.height = this.height;
  }

  setCtxProperties = () => {
    this.canvas.style.position = "absolute";
    this.ctx.font = CitySimilarities.getFont(baseFontSize);
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "left";
  }

  componentDidMount() {
    this.canvas = d3.select(this.canvasRef.current)
    this.ctx = this.canvas.node().getContext("2d");

    this.hiddenCanvas = document.createElement('canvas');
    this.hiddenCtx = this.hiddenCanvas.getContext('2d');

    this.setCtxProperties();

    window.addEventListener('resize', () => { this.updateDimensions(); this.resetCanvas() });
    this.updateDimensions();
    this.handleData().then(() => {
      if (this.props.city) {
        this.handleSearch(this.props.city.id);
      }
    })
  }

  componentDidUpdate(prevProps) {
    this.resetSelection();
    if (this.props.city && (!prevProps.city || this.props.city.id !== prevProps.city.id)) {
      this.handleSearch(this.props.city.id)
    }
  }

  handleData = () => {
    return d3.csv("/data/embedding_cities.csv").then((data) => {
      this.data = data;
      this.prepareData();
      this.setCanvasDimensions();

      this.zoom = d3.zoom()
        .scaleExtent(zoomExtent)
        .on("zoom", () => this.zoomCanvas(d3.event.transform));

      d3.select(this.ctx.canvas).call(this.zoom);
      this.zoom.scaleTo(this.canvas, initialScale);
      this.redraw();
    }).then(() => this.data)
  }


  updateDimensions = () => {
    this.height = this.divElement.parentElement.clientHeight - 15;
    this.width = this.divElement.parentElement.clientWidth;
  };

  resetCanvas = () => {
    this.setCanvasDimensions();
    this.prepareData();
    this.redraw();
    // this.zoom.scaleTo(this.canvas, this.currentK);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  resetSelection = () => {
    if (this.selection)
      this.selection.highlight = false
  }

  setSelection = (d) => {
    this.resetSelection()
    this.selection = d
    d.highlight = true;
  }

  handleSearch = (cityId) => {
    var city = null;
    for (let d of this.data) {
      if (d.id === cityId) {
        city = d;
        this.setSelection(d);
        break;
      }
    }

    if (city) {
      d3.select(this.ctx.canvas).transition().duration(750).call(
        this.zoom.transform,
        d3.zoomIdentity.translate(this.width / 2, this.height / 2).scale(10).translate(-city.cx, -city.cy)
      );
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root} ref={(divElement) => { this.divElement = divElement }}>
          <canvas ref={this.canvasRef}>
          </canvas>
        </div>
      </React.Fragment>
    );
  }
}


CitySimilarities.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CitySimilarities);
