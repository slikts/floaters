import { Application } from 'pixi.js'

import { log, init } from './util'

import { tween, Tweenable } from 'shifty'

const imageNums = [3, 6, 9, 12, 15, 18, 23, 30, 33, 38, 41, 45, 49, 52]

const duration: [number, number] = [500, 3000]
const sceneSize = [1280, 720]

const multiConcat = (n: number, arr: number[]) => [].concat(...Array(n).fill(arr))
const getRandomArbitrary = (min: number, max: number) => Math.random() * (max - min) + min
const randomCoord = (x: number, min = 0, max = 1) => getRandomArbitrary(min, max) * x
const degToRad = (degrees: number) => degrees * (Math.PI / 180)

type Coords = {
  x: number,
  y: number,
}

const formulaNames = Object.keys(Tweenable.formulas)
const getRandomFormulaName = () => formulaNames[Math.floor(getRandomArbitrary(0, formulaNames.length))]

export default class Floaters {
  readonly app: Application

  constructor() {
    const [sceneX, sceneY] = sceneSize
    const app = new Application(sceneX, sceneY, { transparent: true })

    init(this, {
      app,
    })
  }

  async run() {
    const { app, app: { stage, renderer } } = this

    const background = PIXI.Sprite.fromImage('images/background.png')

    background.texture.baseTexture.on('loaded', () => {
      background.scale.x = renderer.width / background.width
      background.scale.y = renderer.height / background.height
    })
    stage.addChild(background)

    const upperEyelid = PIXI.Sprite.fromImage('images/eyelid.png')

    upperEyelid.texture.baseTexture.on('loaded', () => {
      upperEyelid.width = renderer.width
      upperEyelid.height = renderer.height
    })
    upperEyelid.anchor.set(0.5, 0)
    upperEyelid.x = renderer.width / 2
    upperEyelid.y = -renderer.height

    const lowerEyelid = PIXI.Sprite.fromImage('images/eyelid.png')

    lowerEyelid.texture.baseTexture.on('loaded', () => {
      lowerEyelid.width = renderer.width
      lowerEyelid.height = renderer.height
    })
    lowerEyelid.anchor.set(0.5, 1)
    lowerEyelid.rotation = degToRad(180)
    lowerEyelid.x = renderer.width / 2
    lowerEyelid.y = renderer.height
    

    document.body.appendChild(app.view)

    const randomCoords = (min?: number, max?: number): Coords => ({
      x: randomCoord(renderer.width, ...[min, max]),
      y: randomCoord(renderer.height, ...[min, max]),
    })
    
    const floaterSprites = multiConcat(10, imageNums).map(n => PIXI.Sprite.fromImage(`images/slices_${n}.png`))

    const floaterContainer = new PIXI.Container()

    floaterSprites.forEach(sprite => {
      sprite.rotation += degToRad(Math.random() * 360)
      Object.assign(sprite, randomCoords(-1, 2))
      sprite.blendMode = PIXI.BLEND_MODES.DARKEN
      floaterContainer.addChild(sprite)
    })

    stage.addChild(floaterContainer)
    stage.addChild(upperEyelid)
    stage.addChild(lowerEyelid)

    const extractCoords = ({x, y}: Coords) => ({x, y})
    const [minDuration, maxDuration] = duration
    
    const randomFloat = (coords?: Coords) => {
      const curveFactor = getRandomArbitrary(-1, 1)
      let curve = 0
      const easing = getRandomFormulaName()
      return tween({
        from: extractCoords(floaterContainer),
        to: coords || randomCoords(),
        duration: getRandomArbitrary(minDuration, maxDuration),
        easing,
        step: ({x, y}: Coords) => {
          floaterContainer.x = x + curve
          floaterContainer.y = y + curve
          curve += curveFactor
        }
      }).then(() => {
        randomFloat(Math.random() < 0.1 ? { x: 0, y: 0} : undefined)
      })
    }

    randomFloat()

    const eyelidStates = {
      open: {
        upperY: -renderer.height,
        lowerY: renderer.height,
        alpha: 0,
        scaleX: 1
      },
      closed: {
        upperY: 0,
        alpha: 0.8,
        lowerY: renderer.height / 1.6,
        scaleX: 10,
      },
    }

    const setState = ({upperY, alpha, lowerY, scaleX}: {upperY: number, alpha: number, lowerY: number, scaleX: number}) => {
      upperEyelid.y = upperY
      upperEyelid.alpha = alpha
      lowerEyelid.alpha = alpha
      upperEyelid.scale.x = scaleX
      lowerEyelid.scale.x = scaleX
      lowerEyelid.y = lowerY
    }

    let blinking = false
    let closing = false
    let closed = false

    const closeEyelids = async () => {
      if (closing) {
        return
      }
      closing = true
      await tween({
        from: eyelidStates.open,
        to: eyelidStates.closed,
        easing: 'easeOutQuad',
        duration: 100,
        step: setState,
      })
      if (!closing) {
        openEyelids()
      }
    }
    const openEyelids = () => {
      closing = false
      tween({
        from: eyelidStates.closed,
        to: eyelidStates.open,
        easing: 'easeOutQuad',
        duration: 100,
        step: setState,
      })
    }

    const blink = async () => {
      await closeEyelids()
      await openEyelids()
    }
    blink()

    document.body.addEventListener('pointerdown', () => {
      closeEyelids()
    })
    document.body.addEventListener('pointerup', () => {
      openEyelids()
    })

  }
}
