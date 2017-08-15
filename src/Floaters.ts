import { Application } from 'pixi.js'

import {
  log,
  init,
  multiConcat,
  getRandomArbitrary,
  degToRad,
} from './util'
import Planes from './Planes'
import Eyelids from './Eyelids'
import { Config } from './Config'


export default class Floaters {
  readonly app: Application

  constructor(readonly config: Config) {
    const [sceneX, sceneY] = config.sceneSize
    const app = new Application(sceneX, sceneY, { transparent: true })

    init(this, {
      app,
      config,
    })
  }

  async run() {
    const { app, app: { stage, renderer } } = this

    const eyelids = new Eyelids(renderer)
    const {upperEyelid, lowerEyelid} = eyelids

    const background = PIXI.Sprite.fromImage('images/background.png')

    background.texture.baseTexture.on('loaded', () => {
      background.scale.x = renderer.width / background.width
      background.scale.y = renderer.height / background.height
    })
    stage.addChild(background)

    const planes = new Planes(renderer, this.config)
    stage.addChild(planes.container)
    stage.addChild(upperEyelid)
    stage.addChild(lowerEyelid)
    
    document.body.appendChild(app.view)

    planes.float()
    setTimeout(() => eyelids.blink(), 100)
    setInterval(() => {
      if (Math.random() < 0.9) {
        return
      }
      eyelids.blink()
    }, 500)

    document.body.addEventListener('pointerdown', () => {
      eyelids.close()
    })
    document.body.addEventListener('pointerup', () => {
      eyelids.open()
    })

  }
}
