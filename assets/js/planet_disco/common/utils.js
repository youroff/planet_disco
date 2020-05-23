import { Vector3 } from 'three/src/math/Vector3'
import { CubicBezierCurve3 } from 'three/src/extras/curves/CubicBezierCurve3'
import { geoInterpolate } from 'd3-geo'
import { Spherical } from 'three'

export const toRad = (x) => x * Math.PI / 180
 
export const updateQuery = (key) => (base, {fetchMoreResult}) => {
  if (!fetchMoreResult) return base;
  return Object.assign({}, base, {
    [key]: Object.assign({}, base[key], {
      entries: [...base[key].entries, ...fetchMoreResult[key].entries],
      cursor: fetchMoreResult[key].cursor
    })
  })
}

export const processScroll = (variables, trigger, relation, query) => (e) => {
  const leftover = e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop
  if (leftover < trigger && !query.loading && query.data[relation].cursor) {
    query.fetchMore({
      variables: {...variables, cursor: query.data[relation].cursor},
      updateQuery: updateQuery(relation)
    })
  }
}

const GLOBE_RADIUS = 1
const CURVE_MIN_ALTITUDE = 0.1
const CURVE_MAX_ALTITUDE = 0.7

export function clamp(num, min, max) {
  return num <= min ? min : (num >= max ? max : num);
}

export function coordToVec({ lat, lng }, r = 1) {
  return new Vector3().setFromSphericalCoords(r, toRad(lat - 90), toRad(lng - 90))
}

export function getSplineFromCoords(coord1, coord2) {
  const start = coordToVec(coord1, GLOBE_RADIUS)
  const end = coordToVec(coord2, GLOBE_RADIUS)

  const altitude = clamp(start.distanceTo(end) * .5, CURVE_MIN_ALTITUDE, CURVE_MAX_ALTITUDE)

  const interpolate = geoInterpolate([coord1.lng, coord1.lat], [coord2.lng, coord2.lat])

  const [lng, lat] = interpolate(0.3)
  const mid1 = coordToVec({ lat, lng }, GLOBE_RADIUS + altitude)

  const [lng2, lat2] = interpolate(0.7)
  const mid2 = coordToVec({ lat: lat2, lng: lng2 }, GLOBE_RADIUS + altitude)

  return new CubicBezierCurve3(start, mid1, mid2, end)
}

export function computeDirection({ x, y, z }) {
  const v = new Vector3(x, y, z)
  const { phi, theta } = new Spherical().setFromVector3(v)
  return { phi, theta }
}
