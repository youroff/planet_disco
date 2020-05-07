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

const PIXEL_RATIO = (function () {
  var ctx = document.createElement("canvas").getContext("2d"),
    dpr = window.devicePixelRatio || 1,
    bsr = ctx.webkitBackingStorePixelRatio ||
      ctx.mozBackingStorePixelRatio ||
      ctx.msBackingStorePixelRatio ||
      ctx.oBackingStorePixelRatio ||
      ctx.backingStorePixelRatio || 1;

  return dpr / bsr;
})();

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

      let visible = this.data.filter((d) => {
        let newX = d.cx * transform.k + transform.x;
        let newY = d.cy * transform.k + transform.y;
        d.dotVisible = (newX > 0 && newX < this.width) && (newY > 0 && newY < this.height)
        return d.dotVisible
      })

      this.rescaleContext(this.hiddenCtx, transform);
      this.drawGlow(visible);
      this.hiddenCtx.clearRect(0, 0, this.width, this.height);
      let layout = this.calculateTextLayout(visible);
      this.drawBoxes(this.hiddenCtx, layout);
      this.hiddenCtx.restore();

      this.rescaleContext(this.ctx, transform);
      this.drawPoints(visible);
      this.drawLabels(layout);
      this.ctx.restore();
    });
  }

  drawBoxes(ctx, layout) {
    layout.forEach(l => {
      let color = "#" + (+l.data.id).toString(16).padStart(6, '0')
      ctx.fillStyle = color
      ctx.fillRect(l.topLeft.x, l.topLeft.y, l.bottomRight.x - l.topLeft.x, l.bottomRight.y - l.topLeft.y)
    })
  }

  drawGlow = (visible) => {
    const radiusScale = 1.5;
    this.hiddenCtx.fillStyle = "white";
    visible.forEach((d) => {
      if (d.highlight)
        this.drawPoint(d, this.hiddenCtx, radiusScale)
    })

    if (isChrome) { //Only chrome seems to be able to handle it at the moment
      this.ctx.save();
      let filter = `blur(7px) saturate(110%) brightness(110%) `;
      this.ctx.filter = filter;
    }
    this.ctx.drawImage(this.hiddenCanvas, 0, 0);
    if (isChrome)
      this.ctx.restore();
  }

  drawPoints = (visible) => {
    let prevColor = null
    visible.sort((d) => d.color).forEach(d => {
      if (d.color != prevColor){
        this.ctx.fillStyle = d.color;
        prevColor = d.color;
      }
      this.drawPoint(d, this.ctx)
    })
  }

  // showVisible = (f) => {
  //   this.data.forEach((d) => {
  //     if (d.dotVisible)
  //       f(d)
  //   });
  // }

  drawLabels = (layout) => {
    this.ctx.fillStyle = "white";
    layout.forEach(this.drawLabel)
  }

  labelsOverlap = (a, b) => {
    if (a.topLeft.x >= b.bottomRight.x || b.topLeft.x >= a.bottomRight.x)
      return false

    if (a.topLeft.y >= b.bottomRight.y || b.topLeft.y >= a.bottomRight.y)
      return false

    return true
  }

  labelXOffset = (textMeasure) => {
    let x = - textMeasure / 4;
    return x;
  }

  labelLayout = (d, textMeasure) => {
    const xOffset = this.labelXOffset(textMeasure);
    const height = this.fontSize;
    let width = textMeasure;
    let y = d.cy + labelOffsetY / this.currentK;
    let x = d.cx + xOffset;
    return {
      xOffset: xOffset,
      topLeft: { x: x, y: y - height },
      bottomRight: { x: x + width, y: y },
      data: d
    }
  }

  partitionByExistingTextVisibility(a) {
    const viz = [];
    const non_viz = [];
    a.forEach(a => {
      if (a.textVisible)
        viz.push(a)
      else
        non_viz.push(a);
    })
    return [viz, non_viz]
  }

  layOut = (toLayout, textLayout) => {
    toLayout.forEach((d) => {
      const textMeasure = d.city.length * this.fontSize;
      const labelLayout = this.labelLayout(d, textMeasure)

      for (let i = 0; i < textLayout.length; i++) {
        const other = textLayout[i];
        if (this.labelsOverlap(labelLayout, other)) {
          d.textVisible = false;
          return;
        }
      }
      labelLayout.data.textVisible = true;
      textLayout.push(labelLayout);
    })

    return textLayout;
  }

  labelShouldBeVisible = (d) => {
    return (d.rank < 11 || d.scale <= this.currentK)
  }

  calculateTextLayout = (visibleDots) => {
    this.fontSize = Math.max(12 / this.currentK, baseFontSize / (Math.pow(this.currentK, 1.8)));
    this.ctx.font = CitySimilarities.getFont(this.fontSize);
    const [laidOut, toLayout] = this.partitionByExistingTextVisibility(
      visibleDots.filter((d) => this.labelShouldBeVisible(d))
        .sort((a, b) => a.rank - b.rank))

    const textLayout = this.layOut(laidOut, []);

    return this.layOut(toLayout, textLayout)
  }

  drawLabel = (layout) => {
    let d = layout.data;
    this.ctx.fillText(d.city, layout.topLeft.x, layout.bottomRight.y);
  }

  redraw = () => {
    this.zoom.scaleTo(this.canvas, this.currentK);
  }

  static getFont(fontSize) {
    return `${fontSize}px Arial, sans-serif`;
  }

  drawPoint = (d, context, radiusScale = 1) => {
    context.beginPath();
    context.arc(d.cx, d.cy, radiusScale * d.radius / this.currentK, 0, 2 * Math.PI);
    context.fill();
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
      d.dotVisible = true;
      d.highlight = false;
    });
  }

  setCanvasDimensions = () => {
    let canvasNode = this.canvas.node()

    let ratio = isChrome ? Math.min(2, PIXEL_RATIO) : 1;
    console.log(ratio);

    canvasNode.width = this.width * ratio;
    canvasNode.height = this.height * ratio;

    canvasNode.style.width = this.width + "px";
    canvasNode.style.height = this.height + "px";
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);


    this.hiddenCanvas.width = this.width;
    this.hiddenCanvas.height = this.height;
  }

  setCtxProperties = () => {
    this.canvas.style.position = "absolute";
    this.ctx.font = CitySimilarities.getFont(baseFontSize);
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "left";
  }

  rgbaToId = (rgba) => {
    return (rgba[0] << 16) + (rgba[1] << 8) + rgba[2];
  }

  findUnderMouseId = (e) => {
    //Figure out where the mouse click occurred.
    const mouseX = e.layerX;
    const mouseY = e.layerY;
    const rgba = this.hiddenCtx.getImageData(mouseX, mouseY, 1, 1).data;
    return this.rgbaToId(rgba);
  }

  componentDidMount() {
    this.canvas = d3.select(this.canvasRef.current)
    this.ctx = this.canvas.node().getContext("2d");

    this.hiddenCanvas = document.createElement('canvas');
    this.hiddenCtx = this.hiddenCanvas.getContext('2d');

    this.setCtxProperties();

    // Listen for clicks on the main canvas
    this.canvasRef.current.addEventListener("click", (e) => {
      const id = this.findUnderMouseId(e);
      let d = this.findCity(id)
      if (d)
        this.props.onCitySelect({ id: id, city: d.city, humanCountry: "" })
    });

    // Listen for mouse move on the main canvas
    this.canvasRef.current.addEventListener("mousemove", (e) => {
      const id = this.findUnderMouseId(e);
      if (this.findCity(id))
        this.redraw()
      else {
        if (this.resetSelection())
          this.redraw();
      }
    });

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
    this.height = this.divElement.parentElement.clientHeight;
    this.width = this.divElement.parentElement.clientWidth;
  };

  resetCanvas = () => {
    this.setCanvasDimensions();
    this.prepareData();
    this.redraw();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  resetSelection = () => {
    let prev = false;
    if (this.selection) {
      prev = this.selection.highlight;
      this.selection.highlight = false
    }
    return prev;
  }

  setSelection = (d) => {
    this.resetSelection()
    this.selection = d
    d.highlight = true;
  }

  findCity = (cityId) => {
    if (cityId == 0)
      return null;

    var city = null;
    for (let d of this.data) {
      if (d.id == cityId) {
        city = d;
        this.setSelection(d);
        break;
      }
    }
    return city;
  }

  handleSearch = (cityId) => {
    let city = this.findCity(cityId)
    if (city) {
      d3.select(this.ctx.canvas).transition().duration(1000).call(
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
