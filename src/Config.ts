import {
  log,
  multiConcat,
} from './util'

export type Config = {
  sceneSize: [number, number],
  planeNumber: number,
  floatersPerPlane: number,
  blendMode: 'NORMAL' | 'ADD' | 'MULTIPLY' | 'SCREEN' | 'OVERLAY' | 'DARKEN' | 'LIGHTEN' | 'COLOR_DODGE' | 'COLOR_BURN' | 'HARD_LIGHT' | 'SOFT_LIGHT' | 'DIFFERENCE' | 'EXCLUSION' | 'HUE' | 'SATURATION' | 'COLOR' | 'LUMINOSITY' | 'NORMAL_NPM' | 'ADD_NPM' | 'SCREEN_NPM',
  trailDelay: number,
  curveFactor: number,
  imageNames: string[],
}

const imageNums = [3, 6, 9, 12, 15, 18, 23, 30, 33, 38, 41, 45, 49, 52]

export const fetchConfig = async () => {
  const config = <Config>await (await fetch('./config.json?' + Math.random())).json()
  return Object.assign(config, {
    imageNames: multiConcat(Math.ceil(config.floatersPerPlane / imageNums.length), imageNums).slice(0, config.floatersPerPlane).map(n => `images/slices_${n}.png`),
    blendMode: PIXI.BLEND_MODES[config.blendMode],
  })
}
