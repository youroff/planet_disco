import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';

import React from 'react'
import * as d3 from 'd3'
import { TextUtils } from './text_layout';
import { PointsLayout } from './point_layout';
import { CitySelector } from './city_selection';
import { gql } from 'apollo-boost'

const zoomExtent = [0.7, 32];
const labelExtent = [1, 10];

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


const RETRIEVE_CITY_BY_ID = gql`
  query CityById($cityId: String) {
    cities(byId: $cityId){
      entries {
        id,
        city,
        population,
        humanCountry,
        coord
      }
      cursor
    }
  }
`;

const styles = theme => ({
  root: {
    letterSpacing: "initial",
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
    this.canvasRef = React.createRef();
    this.currentK = initialScale;
    this.inTransition = false;
  }

  static rescaleContext = (context, transform) => {
    context.save();
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);
  }

  zoomCanvas = (transform) => {
    this.currentK = transform.k;
    window.requestAnimationFrame(() => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.hiddenCtx.clearRect(0, 0, this.width, this.height);

      //Calculate which dots are in the viewport
      let visible = this.data.filter((d) => {
        let newX = d.cx * transform.k + transform.x;
        let newY = d.cy * transform.k + transform.y;
        d.dotVisible = (newX > 0 && newX < this.width) && (newY > 0 && newY < this.height)
        return d.dotVisible
      })

      /*
        Draw the hidden bounding boxes around the text labels that will
        be used to determine what city a user has clicked on
        */
      CitySimilarities.rescaleContext(this.hiddenCtx, transform);
      this.hiddenCtx.clearRect(0, 0, this.width, this.height);
      let layout = this.textLayout.atScale(this.currentK).calculateTextLayout(visible);
      this.textLayout.drawBoxes(layout);
      this.hiddenCtx.restore();

      //Draw the visible parts 
      CitySimilarities.rescaleContext(this.ctx, transform);
      this.pointsLayout.atScale(this.currentK).drawPoints(visible);
      this.textLayout.drawLabels(layout);
      this.ctx.restore();

    });
  }

  redraw = () => {
    if (!this.inTransition)
      this.zoom.scaleTo(this.canvas, this.currentK);
  }

  prepareData = () => {
    let data = this.data;

    this.citySelector = new CitySelector(data)

    //Rescale embedding coordinates to the canvas size
    let x = d3.scaleLinear().range([0, this.width]);
    let y = d3.scaleLinear().range([this.height, 0]);
    x.domain(d3.extent(data, (d) => +d.x));
    y.domain(d3.extent(data, (d) => +d.y));

    // Scale the range of the data
    const labelScale = d3.scaleLinear().range(labelExtent).domain(d3.extent(data, (d) => +d.rank));
    const ex = d3.extent(data, (d) => +d.population);
    const populationRadius = d3.scaleLinear().domain(ex).range([3, 10]);

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
    this.ctx.font = TextUtils.getFont(TextUtils.baseFontSize);
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "left";
  }

  componentDidMount() {
    this.canvas = d3.select(this.canvasRef.current)
    this.ctx = this.canvas.node().getContext("2d");

    this.hiddenCanvas = document.createElement('canvas');
    this.hiddenCtx = this.hiddenCanvas.getContext('2d');

    this.setCtxProperties();

    this.textLayout = new TextUtils(this.ctx, this.hiddenCtx)
    this.pointsLayout = new PointsLayout(this.ctx)
    this.updateDimensions();
    this.handleData().then(() => {
      window.addEventListener('resize', this.handleResize);

      // Listen for clicks on the main canvas
      this.canvasRef.current.addEventListener("click", (e) => {
        const id = this.textLayout.findUnderMouseId(e);
        let d = this.citySelector.findCity(id)
        if (d) {
          this.props.client.query({
            query: RETRIEVE_CITY_BY_ID,
            variables: { cityId: d.id }
          })
            .then((res) =>
              this.props.onCitySelect(res.data.cities.entries[0])
            )
        }
      });

      // Listen for mouse move on the main canvas
      this.canvasRef.current.addEventListener("mousemove", (e) => {
        const id = this.textLayout.findUnderMouseId(e);
        if (this.citySelector.findCity(id))
          this.redraw()
        else {
          if (this.citySelector.resetSelection())
            this.redraw();
        }
      });

      if (this.props.city) {
        this.handleSearch(this.props.city.id);
      }
    })
  }

  handleResize = () => { this.updateDimensions(); this.resetCanvas() }

  componentDidUpdate(prevProps) {
    this.citySelector.resetSelection();
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
        .on("start", () => this.inTransition = true)
        .on("zoom", () => this.zoomCanvas(d3.event.transform))
        .on("end", () => this.inTransition = false)

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
    window.removeEventListener('resize', this.handleResize);
  }

  handleSearch = (cityId) => {
    let city = this.citySelector.findCity(cityId)
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

export default withStyles(styles, { withTheme: true })(CitySimilarities);
