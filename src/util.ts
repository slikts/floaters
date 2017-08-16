export const log = (x: any, ...args: any[]) => {
  console.log(x, ...args)
  return x
}

export const init = <T>(target: T, source: T) => Object.assign(target, source)
export const multiConcat = <T>(n: number, arr: T[]) => [].concat(...Array(n).fill(arr))
export const getRandomArbitrary = (min: number, max: number) => Math.random() * (max - min) + min
export const degToRad = (degrees: number) => degrees * (Math.PI / 180)
export const padStart = require('string.prototype.padstart')
