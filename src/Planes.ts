import { tween } from 'shifty'

import {
  log,
  init,
  getRandomArbitrary,
  degToRad,
} from './util'
import Random from './Random'
import { Config } from './Config'


export type Coords = {
  x: number,
  y: number,
}

const extractCoords = ({x, y}: Coords) => ({x, y})


class Plane {
  container: PIXI.Container

  constructor(readonly random: Random, readonly index: number, readonly config: Config) {
    const sprites = config.imageNames.map(name => PIXI.Sprite.fromImage(name))
    const container = new PIXI.Container()
    
    sprites.forEach(sprite => {
      sprite.rotation += degToRad(Math.random() * 360)
      Object.assign(sprite, random.coords(-1, 2))
      sprite.blendMode = this.config.blendMode
      sprite.scale.set(1 - index / this.config.scaleFactor)
      container.addChild(sprite)
    })

    init(this, {
      index,
      container,
      config,
    })
  }

  float() {
    const randomness = getRandomArbitrary(-this.config.curveFactor, this.config.curveFactor)
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
  
  constructor(readonly renderer: Renderer, readonly config: Config) {
    const sprites = config.imageNames.map(name => PIXI.Sprite.fromImage(name))
    const random = new Random(renderer, config.planeNumber)
    const container = new PIXI.Container()
    const planes = Array.from(Array(config.planeNumber), (_, i) => new Plane(random, i, config))

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
      }, plane.index * this.config.trailDelay)
    })
  }
}
