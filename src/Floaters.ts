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
import * as ReconnectingWebSocket from 'reconnecting-websocket'

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
    const { app, app: { stage, renderer }, config } = this

    // const ws = new WebSocket(config.motionHost)
    const ws = <WebSocket>(new ReconnectingWebSocket(config.motionHost))

    const eyelids = new Eyelids(renderer)
    const {upperEyelid, lowerEyelid} = eyelids

    const background = PIXI.Sprite.fromImage('images/background.png')

    background.texture.baseTexture.on('loaded', () => {
      background.scale.x = renderer.width / background.width
      background.scale.y = renderer.height / background.height
    })
    stage.addChild(background)

    const planes = new Planes(renderer, config)
    stage.addChild(planes.container)
    stage.addChild(upperEyelid)
    stage.addChild(lowerEyelid)
    
    const [portX, portY] = config.portSize
    if (portX && portY) {
      const style = app.view.style
      style.width = `${portX}px`
      style.height = `${portY}px`
      style.marginLeft = '50%'
      style.marginTop = '50%'
      style.position = 'absolute'
      style.left = `-${portX / 2}px`
      style.top = `-${portY / 2}px`
    }
    document.body.appendChild(app.view)

    planes.float()
    setTimeout(() => eyelids.blink(), 100)
    if (config.autoblink) {
      setInterval(() => {
        if (Math.random() > config.blinkChance) {
          return
        }
        eyelids.blink()
      }, 100)
    }

    document.body.addEventListener('pointerdown', () => {
      eyelids.close()
    })
    document.body.addEventListener('pointerup', () => {
      eyelids.open()
    })

    ws.onmessage = ({data}) => {
      console.log(data)
      eyelids.blink()
    }
  }
}
