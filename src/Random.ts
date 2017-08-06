import { Tweenable } from 'shifty'

import {
  log,
  init,
  getRandomArbitrary,
} from './util'
import {Coords} from './Planes'


type Step = {
  coords: Coords,
  duration: number,
  easing: string,
}

const duration: [number, number] = [500, 3000]
const [minDuration, maxDuration] = duration
// const formulaNames = Object.keys(Tweenable.formulas).filter(name => /easeOut/.test(name)).concat('swingTo')
const formulaNames = ['easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'swingTo']
const getRandomFormulaName = () => formulaNames[Math.floor(getRandomArbitrary(0, formulaNames.length))]
const randomCoord = (x: number, min = 0, max = 1) => getRandomArbitrary(min, max) * x


export default class Random {
  count: number
  cached: Step

  constructor(readonly renderer: Renderer, readonly planeCount: number) {
    this.count = planeCount
    init(this, {
      planeCount,
      renderer,
    })
  }

  coords(min?: number, max?: number): Coords {
    return { 
      x: randomCoord(this.renderer.width, ...[min, max]),
      y: randomCoord(this.renderer.height, ...[min, max]),
    }
  }

  biasedCoords() {
    const coords = this.coords()
    coords.y = 0.5 * coords.y
    return coords
  }
  
  getCounted() {
    this.count += 1
    if (this.count >= this.planeCount) {
      this.count = 0
      this.cached = {
        coords: Math.random() < 0.1 ? {x: 0, y: 0} : this.biasedCoords(),
        duration: getRandomArbitrary(minDuration, maxDuration),
        easing: getRandomFormulaName(),
      }
    }
    return this.cached
  }
}
