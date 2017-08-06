import { tween, Tweenable } from 'shifty'

import {
  log,
  init,
  degToRad,
} from './util'

type State = {
  upperY: number,
  lowerY: number,
  alpha: number,
  scaleX: number,
}

type EyelidStates = {
  open: Partial<State>,
  closed: Partial<State>,
}

export default class Eyelids {
  readonly upperEyelid: PIXI.Sprite
  readonly lowerEyelid: PIXI.Sprite
  private blinking = false
  closing = false
  closed = false
  eyelidStates: EyelidStates

  constructor(readonly renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer) {
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
    
    const eyelidStates: EyelidStates = {
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

    init(this, {
      upperEyelid,
      lowerEyelid,
      renderer,
      eyelidStates,
    })
  }

  setState({upperY, alpha, lowerY, scaleX}: {upperY: number, alpha: number, lowerY: number, scaleX: number}) {
    const {upperEyelid, lowerEyelid} = this
    upperEyelid.y = upperY
    upperEyelid.alpha = alpha
    lowerEyelid.alpha = alpha
    upperEyelid.scale.x = scaleX
    lowerEyelid.scale.x = scaleX
    lowerEyelid.y = lowerY
  }

  async close() {
    if (this.closing) {
      return
    }
    this.closing = true
    await tween({
      from: this.eyelidStates.open,
      to: this.eyelidStates.closed,
      easing: 'easeOutQuad',
      duration: 100,
      step: (state: State) => this.setState(state),
    })
    if (!this.closing) {
      this.open()
    }
  }

  open() {
    this.closing = false
    return tween({
      from: this.eyelidStates.closed,
      to: this.eyelidStates.open,
      easing: 'easeOutQuad',
      duration: 100,
      step: (state: State) => this.setState(state),
    })
  }

  async blink() {
    await this.close()
    await this.open()
  }
}
