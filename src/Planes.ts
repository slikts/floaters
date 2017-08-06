import { tween } from 'shifty'

import {
  log,
  init,
  multiConcat,
  getRandomArbitrary,
  degToRad,
} from './util'
import Random from './Random'


export type Coords = {
  x: number,
  y: number,
}

const imageNums = [3, 6, 9, 12, 15, 18, 23, 30, 33, 38, 41, 45, 49, 52]
const planeNumber = 5
const floatersPerPlane = 200
const blendMode = PIXI.BLEND_MODES.DARKEN
const imageNames = multiConcat(Math.ceil(floatersPerPlane / imageNums.length), imageNums).slice(0, floatersPerPlane).map(n => `images/slices_${n}.png`)
const trailDelay = 20
const curveFactor = 0.5

const extractCoords = ({x, y}: Coords) => ({x, y})


class Plane {
  container: PIXI.Container

  constructor(readonly random: Random, readonly index: number) {
    const sprites = imageNames.map(name => PIXI.Sprite.fromImage(name))
    const container = new PIXI.Container()
    
    sprites.forEach(sprite => {
      sprite.rotation += degToRad(Math.random() * 360)
      Object.assign(sprite, random.coords(-1, 2))
      sprite.blendMode = blendMode
      sprite.scale.set(1 - index / 10)
      container.addChild(sprite)
    })

    init(this, {
      index,
      container,
    })
  }

  float() {
    const randomness = getRandomArbitrary(-curveFactor, curveFactor)
    let curve = 0
    const step = this.random.getCounted()
    const {coords, duration, easing} = step
    return tween({
      from: extractCoords(this.container),
      to: coords,
      duration,
      easing,
      step: ({x, y}: Coords) => {
        this.container.x = x + curve
        this.container.y = y + curve
        curve += randomness
      }
    }).then(() => {
      this.float()
    })
  }
}


export default class Planes {
  container: PIXI.Container
  random: Random
  planes: Plane[]
  
  constructor(readonly renderer: Renderer) {
    const sprites = imageNames.map(name => PIXI.Sprite.fromImage(name))
    const random = new Random(renderer, planeNumber)
    const container = new PIXI.Container()
    const planes = Array.from(Array(planeNumber), (_, i) => new Plane(random, i))

    planes.reverse().forEach(plane => {
      container.addChild(plane.container)
    })

    init(this, {
      container,
      random,
      planes,
    })
  }
  
  float() {
    this.planes.forEach(plane => {
      setTimeout(() => {
        plane.float()
      }, plane.index * trailDelay)
    })
  }
}
