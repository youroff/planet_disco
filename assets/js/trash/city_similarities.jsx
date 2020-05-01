import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'

const myColor = d3.scaleSequential().domain([0,1]).interpolator(d3.interpolateSpectral)

export function CitySimilarities() {

  const svgRef = useRef(null)
  const [data, setData] = useState(null);
  const [{ x, y, k }, setTransform] = useState({ x: 0, y: 0, k: 1 })

  useEffect(() => {
    if (!svgRef.current) return
    const selection = d3.select(svgRef.current)
    const zoom = d3.zoom().on("zoom", () => { 
      const data = d3.event.transform
      requestAnimationFrame(() => {
        setTransform(data)
      })
    })
    selection.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(400, 200).scale(15))
    return () => selection.on(".zoom", null)
  }, [svgRef])

  useEffect(() => {
    d3.csv("/data/embedding_cities.csv").then(setData)
  }, []);

  return <svg ref={svgRef} viewBox="0 0 800 550" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation={0.5 * k}></feGaussianBlur>
      </filter>
    </defs>
    <g filter="url(#glow)" transform={`translate(${x}, ${y}) scale(${k})`}>
      {data && data.map((city, i)  => (
        <g transform={`translate(${city.x}, ${city.y}) scale(${1 / k})`} key={i}>
          <circle r={1} fill={myColor(city.geohash_norm)}/>
        </g>
      ))}
    </g>
    <g transform={`translate(${x}, ${y}) scale(${k})`}>
      {data && data.map((city, i)  => (
        <g transform={`translate(${city.x}, ${city.y}) scale(${1 / k})`} key={i}>
          <circle r={1} fill={myColor(city.geohash_norm)}/>
          <text x={1} y={-1}
            className={city.population * k > 40000000 ? 'city-name-shown' : 'city-name-hidden'}
          >{city.city}</text>
        </g>
      ))}
    </g>
  </svg>;
}
